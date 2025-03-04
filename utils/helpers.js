const helpers = {
  sendResponse(statusCode, message, data = {}) {
    return {
      statusCode,
      message,
      data,
    };
  },
};

module.exports = helpers;
