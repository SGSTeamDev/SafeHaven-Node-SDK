const querystring = require("querystring");

const axios = require("axios");
const { AppError } = require("../middleware/error.js");

class Auth {
  constructor({ client_id, client_assertion, env = "sandbox" }) {
    if (!client_id) throw new AppError(400, "client_id is required.");
    if (!client_assertion) {
      throw new AppError(400, "client_assertion is required.");
    }

    const allowed_envs = ["production", "sandbox"];
    if (!allowed_envs.includes(env.toLowerCase())) {
      throw new AppError(
        400,
        `Invalid environment. Allowed environments are: ${allowed_envs.join(
          ", "
        )}`
      );
    }

    this.env = env.toLowerCase();
    this.client_id = client_id;
    this.client_assertion = client_assertion;
    this.base_url =
      this.env === "production"
        ? "https://api.safehavenmfb.com"
        : "https://api.sandbox.safehavenmfb.com";

    this.access_token = null;
    this.refresh_token = null;
    this.ibs_client_id = null;
    this.token_expiry = null;
  }

  static async init(config) {
    const instance = new Auth(config);
    await instance.authenticate({ grant_type: "client_credentials" });
    return instance;
  }

  async authenticate({
    grant_type = "client_credentials",
    refresh_token = null,
  }) {
    try {
      const body = {
        grant_type,
        client_id: this.client_id,
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: this.client_assertion,
      };

      if (grant_type === "refresh_token") {
        if (!refresh_token)
          throw new AppError(400, "refresh_token is required.");
        body.refresh_token = refresh_token;
      }

      const response = await axios.post(
        `${this.base_url}/oauth2/token`,
        querystring.stringify(body),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { status, data } = response;
      const {
        access_token,
        refresh_token: new_refresh_token,
        ibs_client_id,
        expires_in,
      } = data;

      this.access_token = access_token;
      this.refresh_token = new_refresh_token || this.refresh_token;
      this.ibs_client_id = ibs_client_id;
      this.token_expiry = Date.now() + expires_in * 1000;

      return {
        statusCode: status,
        message: "Successful",
        data: response.data,
      };
    } catch (error) {
      const err_res = error?.response?.data || {};
      throw new AppError(
        err_res?.statusCode || error?.response?.status || 500,
        err_res?.message || "",
        err_res?.error || "",
        err_res?.error_description || ""
      );
    }
  }

  async refreshAccessToken() {
    if (!this.refresh_token)
      throw new AppError(
        401,
        "No refresh token available.",
        "Unauthorized",
        "Authentication details not found or authentication not yet done."
      );
    return await this.authenticate({
      grant_type: "refresh_token",
      refresh_token: this.refresh_token,
    });
  }

  isTokenExpired() {
    return !this.token_expiry || Date.now() >= this.token_expiry;
  }

  async getAuthHeaders() {
    if (this.isTokenExpired()) await this.refreshAccessToken();

    if (!this.access_token || !this.ibs_client_id) {
      throw new AppError(
        401,
        "No refresh token available.",
        "Unauthorized",
        "Authentication details not found or authentication not yet done."
      );
    }

    return {
      Authorization: this.access_token,
      ClientID: this.ibs_client_id,
    };
  }
}

module.exports = Auth;
