const axios = require("axios");

const { AppError } = require("../middleware/error.js");
const { sendResponse } = require("../utils/helpers");
const { safeProviderRequestId, safeProviderText } = require("./providerSafety");

const SAFE_PROVIDER_FIELDS = [
  "statusCode",
  "status_code",
  "message",
  "error",
  "error_description",
  "code",
  "request_id",
  "requestId",
];

function safeProviderValue(field, value) {
  if (["statusCode", "status_code"].includes(field)) {
    return Number.isInteger(value) ? value : null;
  }

  if (["request_id", "requestId"].includes(field)) {
    return safeProviderRequestId(value);
  }

  return safeProviderText(value);
}

function safeProviderData(responseBody) {
  if (!responseBody || typeof responseBody !== "object" || Array.isArray(responseBody)) {
    return null;
  }

  return Object.fromEntries(
    SAFE_PROVIDER_FIELDS
      .filter((field) => Object.prototype.hasOwnProperty.call(responseBody, field))
      .map((field) => [field, safeProviderValue(field, responseBody[field])])
      .filter(([, value]) => value !== null),
  );
}

function providerResponse(error, responseBody = null) {
  const responseRequestId = responseBody?.request_id || responseBody?.requestId;

  return {
    status_code:
      error?.statusCode ?? error?.status ?? error?.response?.status ?? null,
    message: safeProviderText(error?.message),
    error: safeProviderText(error?.error),
    error_description: safeProviderText(error?.error_description),
    request_id:
      safeProviderRequestId(error?.request_id) ||
      safeProviderRequestId(error?.response?.headers?.["x-request-id"]) ||
      safeProviderRequestId(error?.response?.headers?.["request-id"]) ||
      safeProviderRequestId(responseRequestId) ||
      null,
    data: safeProviderData(responseBody),
  };
}

function createProviderError(error) {
  const responseBody = error?.response?.data || error?.provider_response?.data || null;
  const response = providerResponse(error, responseBody);
  const statusCode = response.status_code || error?.response?.status || 500;
  const message = response.message || safeProviderText(response.data?.message) || "Something went wrong";
  const providerError = response.error || safeProviderText(response.data?.error) || "";
  const description = response.error_description || safeProviderText(response.data?.error_description) || "";

  return new AppError(statusCode, message, providerError, description, response);
}

const base = (auth_service) => {
  if (!auth_service) {
    throw new AppError(500, "Auth service not initialized");
  }

  const request = async (path, payload = {}) => {
    try {
      if (!payload.method) {
        throw new AppError(400, "Request method is required.");
      }

      const method = payload.method.toUpperCase();
      let request_url = `${auth_service.base_url}${path}`;

      if (method === "GET" && payload.query) {
        const query_string = new URLSearchParams(payload.query).toString();
        request_url += query_string ? `?${query_string}` : "";
      }

      if (["GET", "DELETE"].includes(method)) {
        delete payload.data;
      }

      const auth_headers = await auth_service.getAuthHeaders();

      const config = {
        method,
        url: request_url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_headers.Authorization}`,
          ClientID: auth_headers.ClientID,
        },
        data: payload.data,
      };

      const response = await axios(config);
      const data = response.data;

      // error responses
      if (data.error || ![200, 201].includes(data.statusCode)) {
        throw new AppError(
          data.statusCode || response.status,
          safeProviderText(data.message) || "",
          safeProviderText(data.error) || "",
          safeProviderText(data.error_description) || "",
          providerResponse(
            {
              statusCode: data.statusCode || response.status,
              message: data.message || "",
              error: data.error || "",
              error_description: data.error_description || "",
              response: { headers: response.headers },
            },
            data,
          ),
        );
      }

      //  array responses
      if (Array.isArray(data.data)) {
        const { statusCode, message, ...extra_data } = data;
        return sendResponse(
          statusCode || response.status,
          message || "Successful",
          extra_data,
        );
      }

      // standard response
      return sendResponse(
        data.statusCode || response.status,
        data.message || "Successful",
        data.data,
      );
    } catch (error) {
      // known AppError
      if (error instanceof AppError) {
        throw error;
      }

      // API error responses
      const response = error?.response?.data || {};

      if (response.statusCode) {
        throw createProviderError(error);
      }

      // fallback for unexpected errors
      throw createProviderError(error);
    }
  };

  return request;
};

module.exports = base;
