const axios = require("axios");

const { AppError } = require("../middleware/error.js");
const { sendResponse } = require("../utils/helpers");

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
        payload.data = undefined;
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
          data.message || "",
          data.error || "",
          data.error_description || ""
        );
      }

      //  array responses
      if (Array.isArray(data.data)) {
        const { statusCode, message, ...extra_data } = data;
        return sendResponse(
          statusCode || response.status,
          message || "Successful",
          extra_data
        );
      }

      // standard response
      return sendResponse(
        data.statusCode || response.status,
        data.message || "Successful",
        data.data
      );
    } catch (error) {
      // known AppError
      if (error instanceof AppError) {
        throw error;
      }

      // API error responses
      const response = error?.response?.data || {};

      if (response.statusCode) {
        throw new AppError(
          response.statusCode,
          response.message || "",
          response.error || "",
          response.error_description || ""
        );
      }

      // fallback for unexpected errors
      throw new AppError(
        error.response?.status || 500,
        "Something went wrong",
        "",
        ""
      );
    }
  };

  return request;
};

module.exports = base;
