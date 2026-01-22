const { AppError } = require("../middleware/error.js");

class VirtualAccount {
  constructor(request) {
    this.request = request;
  }

  async create(data) {
    return this.request("/virtual-accounts", { method: "POST", data });
  }

  async account(id) {
    return this.request(`/virtual-accounts/${id}`, {
      method: "GET",
    });
  }

  async transaferStatus(data) {
    if (!data || !data.sessionId) {
      throw new AppError(400, "sessionId is required.");
    }

    return this.request("/virtual-accounts/status", { method: "POST", data });
  }

  async transaction(data) {
    if (!data || !data.virtualAccountId) {
      throw new AppError(400, "virtualAccountId is required.");
    }

    return this.request(
      `/virtual-accounts/${data.virtualAccountId}/transaction`,
      {
        method: "GET",
      },
    );
  }

  async update(data) {
    if (!data || !data.account_id) {
      throw new AppError(400, "account_id is required.");
    }

    return this.request(`/virtual-accounts/${data.account_id}`, {
      method: "PUT",
      data,
    });
  }

  async delete(id) {
    return this.request(`/virtual-accounts/${id}`, {
      method: "DELETE",
    });
  }
}

module.exports = VirtualAccount;
