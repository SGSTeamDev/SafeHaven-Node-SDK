class Verification {
  constructor(request) {
    this.request = request;
  }

  async initiate(data) {
    return this.request("/identity/v2", { method: "POST", data });
  }

  async validate(data) {
    return this.request("/identity/v2/validate", { method: "POST", data });
  }
}

module.exports = Verification;
