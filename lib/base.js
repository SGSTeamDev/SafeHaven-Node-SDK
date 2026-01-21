const querystring = require("querystring");

const axios = require("axios");
const { AppError } = require("../middleware/error.js");
const { sendResponse } = require("../utils/helpers");

const base = (key) => {
  if (!key) throw new AppError(500, "Key is required.");

  const url = {
    live: "https://api.example.com",
    test: "https://sandbox.api.example.com",
  };

  const base_url = key.startsWith("sk_live") ? url.live : url.test;

  const request = async (path, payload = {}) => {
    try {
      if (!payload.method) {
        throw new AppError(500, "Request method is required.");
      }

      const method = payload.method.toUpperCase();
      let request_url = `${base_url}${path}`;

      // add query string to url
      if (method.toUpperCase() === "GET" && payload.query) {
        const query_string = querystring.stringify(payload.query);
        request_url += query_string ? `?${query_string}` : "";
      }

      // set payload data (request payload) to empty object if method is GET or DELETE
      if (method.toUpperCase() === "GET" || method.toUpperCase() === "DELETE") {
        payload.data = {};
      }

      const config = {
        method,
        url: request_url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        data: payload.data,
      };

      const response = await axios(config);

      return sendResponse(
        response.status,
        response.data.message,
        response.data.data
      );
    } catch (error) {
      if (error && error.response.data) {
        throw new AppError(
          error.response.status,
          error.response.data.message,
          error.response.data
        );
      } else {
        throw new AppError(500, "API error.");
      }
    }
  };

  return request;
};

module.exports = base;
