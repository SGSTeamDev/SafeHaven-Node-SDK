const { AppError } = require("../middleware/error.js");

class Account {
  constructor(request) {
    this.request = request;
  }

  async accounts(query) {
    return this.request(`/accounts`, {
      method: "GET",
      query,
    });
  }

  async account(id) {
    return this.request(`/accounts/${id}`, {
      method: "GET",
    });
  }

  async create(data) {
    return this.request("/accounts", { method: "POST", data });
  }

  async update(data) {
    if (!data || !data.account_id) {
      throw new AppError(400, "account_id is required.");
    }

    return this.request(`/accounts/${data.account_id}`, {
      method: "PUT",
      data,
    });
  }

  async createSubAccount(data) {
    return this.request("/accounts/v2/subaccount", { method: "POST", data });
  }

  async updateSubAccount(data) {
    if (!data || !data.account_id) {
      throw new AppError(400, "account_id is required.");
    }

    return this.request(`/accounts/${data.account_id}/subaccount`, {
      method: "PUT",
      data,
    });
  }

  async statement(data) {
    if (!data || !data.account_id) {
      throw new AppError(400, "account_id is required.");
    }

    const { account_id, ...query } = data;

    return this.request(`/accounts/${account_id}/statement`, {
      method: "GET",
      query,
    });
  }
}

module.exports = Account;
