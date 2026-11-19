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
    const payload = { ...data };
    const otpMode = payload.otpMode;
    delete payload.otpMode;

    if (otpMode === "bypass") {
      if (!payload.identityId) {
        throw new AppError(400, "identityId is required when otpMode is bypass.");
      }
      if (typeof payload.otp !== "undefined") {
        throw new AppError(400, "otp must not be provided when otpMode is bypass.");
      }
      payload.identityType = "vID";
    }

    if (otpMode === "required" && payload.identityType === "vID") {
      throw new AppError(400, "identityType vID cannot use otpMode required.");
    }

    if (typeof otpMode !== "undefined" && !["required", "bypass"].includes(otpMode)) {
      throw new AppError(400, "otpMode must be required or bypass.");
    }

    const response = await this.request("/accounts/v2/subaccount", {
      method: "POST",
      data: payload,
    });

    if (!response.data?.accountNumber) {
      throw new AppError(502, "Safe Haven returned incomplete account details.");
    }

    return response;
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
