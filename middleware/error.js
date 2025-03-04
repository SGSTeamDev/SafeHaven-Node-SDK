const STATUS_DESCRIPTION = {
  400: {
    error: "Bad Request",
    description:
      "The request was unacceptable, due to missing a required parameter or invalid value.",
  },
  401: {
    error: "Unauthorized",
    description: "No valid API key was provided.",
  },
  402: {
    error: "Request Failed",
    description: "The parameters were valid but the request failed.",
  },
  403: {
    error: "Forbidden",
    description: "The API key doesn't have permission to perform the request.",
  },
  404: {
    error: "Not Found",
    description: "The requested resource doesn't exist.",
  },
  409: {
    error: "Conflict",
    description: "The request conflicts with another request.",
  },
  429: {
    error: "Too Many Requests",
    description:
      "Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.",
  },
};

class AppError extends Error {
  constructor(statusCode, message = "", error = "", error_description = "") {
    super(message);

    this.statusCode = statusCode;

    // Use provided error or get from STATUS_DESCRIPTION
    this.error =
      error ||
      (STATUS_DESCRIPTION[statusCode] &&
        STATUS_DESCRIPTION[statusCode].error) ||
      "";

    // Use provided error_description or get from STATUS_DESCRIPTION
    this.error_description =
      error_description ||
      (STATUS_DESCRIPTION[statusCode] &&
        STATUS_DESCRIPTION[statusCode].description) ||
      "";

    // If status code is 500 or above, set default server error messages
    if (statusCode >= 500) {
      this.error = "Server Error";
      this.error_description = "Something went wrong.";
    }

    this.message = message;
  }
}

const handleError = (err) => {
  return {
    statusCode: err.statusCode || 500,
    message: err.message || "",
    error: err.error || "",
    error_description: err.error_description || "",
  };
};

module.exports = {
  AppError,
  handleError,
};
