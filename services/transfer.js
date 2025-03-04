class Transfer {
  constructor(request) {
    this.request = request;
  }

  async banks(query) {
    return this.request("/transfers/banks", { method: "GET", query });
  }

  async nameEnquiry(data) {
    return this.request("/transfers/name-enquiry", { method: "POST", data });
  }

  async create(data) {
    return this.request("/transfers", { method: "POST", data });
  }

  async status(data) {
    return this.request("/transfers/status", { method: "POST", data });
  }

  async list(query) {
    return this.request("/transfers", { method: "GET", query });
  }

  async beneficiaries(query) {
    return this.request("/transfers/beneficiaries", { method: "GET", query });
  }

  async deleteBeneficiary(id) {
    return this.request(`/transfers/beneficiaries/${id}`, {
      method: "DELETE",
    });
  }
}

module.exports = Transfer;
