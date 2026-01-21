const helpers = {
  sendResponse(status_code, message, data) {
    return {
      status_code,
      message,
      data: data ? data : undefined,
    };
  },
};

module.exports = helpers;
