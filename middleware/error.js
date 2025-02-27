const { sendResponse } = require("../utils/helpers");

class AppError extends Error {
  constructor(status_code, message, data = undefined) {
    super(message);
    this.data = data;
    this.status_code = status_code;
  }
}

const handleError = (err) => {
  return sendResponse(
    err.status_code || 500,
    err.message || "Internal server error",
    err.data
  );
};

module.exports = {
  AppError,
  handleError,
};
