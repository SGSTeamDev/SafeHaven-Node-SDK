class Transfer {
  constructor(request) {
    this.request = request;
  }

  async createTransferReceipient(data) {
    return this.request("/transferrecipient", { method: "POST", data });
  }

  async listTransferReceipients(query) {
    return this.request(`/transferrecipient`, { method: "GET", query });
  }

  async initiateTransfer(data) {
    return this.request("/transfer", { method: "POST", data });
  }
}

module.exports = Transfer;
