const querystring = require("querystring");
const axios = require("axios");
const { AppError } = require("../middleware/error.js");
const { setTimeout } = require("timers/promises");

class Auth {
  constructor({ client_id, client_assertion, env = "sandbox" }) {
    if (!client_id) throw new AppError(400, "client_id is required.");
    if (!client_assertion)
      throw new AppError(400, "client_assertion is required.");

    this.env = env.toLowerCase();
    this.client_id = client_id;
    this.client_assertion = client_assertion;
    this.base_url =
      this.env === "production"
        ? "https://api.safehavenmfb.com"
        : "https://api.sandbox.safehavenmfb.com";

    // Token management
    this.access_token = null;
    this.ibs_client_id = null;
    this.token_expiry = null;
    this.refreshInProgress = false;
    this.requestQueue = [];
    this.autoRefreshInterval = null;
    this.REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
    this.MAX_RETRIES = 3;
    this.RETRY_DELAY = 1000; // 1 second
  }

  static async init(config) {
    const instance = new Auth(config);
    await instance.authenticate();
    instance.startAutoRefresh();
    return instance;
  }

  startAutoRefresh() {
    if (this.autoRefreshInterval) clearInterval(this.autoRefreshInterval);

    this.autoRefreshInterval = setInterval(async () => {
      if (!this.refreshInProgress) {
        await this.authenticate();
      }
    }, this.REFRESH_INTERVAL);
  }

  async authenticate(retryCount = 0) {
    try {
      this.refreshInProgress = true;

      const response = await axios.post(
        `${this.base_url}/oauth2/token`,
        querystring.stringify({
          grant_type: "client_credentials",
          client_id: this.client_id,
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: this.client_assertion,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 5000,
        }
      );

      const { access_token, ibs_client_id, expires_in } = response.data;

      this.access_token = access_token;
      this.ibs_client_id = ibs_client_id;
      this.token_expiry = Date.now() + expires_in * 1000;

      this.startAutoRefresh();
      return this.processQueue();
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        await setTimeout(this.RETRY_DELAY * (retryCount + 1));
        return this.authenticate(retryCount + 1);
      }

      this.requestQueue.forEach((req) => req.reject(error));
      this.requestQueue = [];
      throw this.handleError(error);
    } finally {
      this.refreshInProgress = false;
    }
  }

  async getAuthHeaders() {
    if (this.access_token && !this.isTokenExpired()) {
      return {
        Authorization: this.access_token,
        ClientID: this.ibs_client_id,
      };
    }

    if (this.refreshInProgress) {
      return new Promise((resolve) => {
        this.requestQueue.push({ resolve });
      });
    }

    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject });
      // eslint-disable-next-line no-empty-function
      this.authenticate().catch(() => {});
    });
  }

  async makeRequest(config, retryCount = 0) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${headers.Authorization}`,
          ClientID: headers.ClientID,
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      if (this.shouldRetry(error) && retryCount < this.MAX_RETRIES) {
        await setTimeout(this.RETRY_DELAY * (retryCount + 1));
        return this.makeRequest(config, retryCount + 1);
      }
      throw this.handleError(error);
    }
  }

  shouldRetry(error) {
    const status = error.response?.status;
    return (
      !status ||
      status === 429 || // Too Many Requests
      status >= 500 || // Server Errors
      status === 408 || // Request Timeout
      status === 401 // Unauthorized (token might have expired mid-request)
    );
  }

  processQueue() {
    const headers = {
      Authorization: this.access_token,
      ClientID: this.ibs_client_id,
    };

    this.requestQueue.forEach((req) => req.resolve(headers));
    this.requestQueue = [];
  }

  isTokenExpired() {
    return !this.token_expiry || Date.now() >= this.token_expiry;
  }

  handleError(error) {
    const errData = error.response?.data || {};
    return new AppError(
      errData.statusCode || error.response?.status || 500,
      errData.message || "Request failed",
      errData.error || "request_error"
    );
  }

  cleanup() {
    if (this.autoRefreshInterval) clearInterval(this.autoRefreshInterval);
  }
}

module.exports = Auth;
