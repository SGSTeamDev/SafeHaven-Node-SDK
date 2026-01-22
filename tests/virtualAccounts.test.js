const safeHavenSDK = require("../app");

describe("VIRTUAL ACCOUNTS", () => {
  let accountInstance;
  let virtual_account_id;

  beforeAll(() => {
    accountInstance = safeHavenSDK({
      client_id: process.env.CLIENT_ID,
      client_assertion: process.env.CLIENT_ASSERTION,
      env: "sandbox",
    })
      .then((sdk) => sdk.VirtualAccount)
      .catch((error) => {
        console.log(error);
      });
  });

  describe("CREATE VIRTUAL ACCOUNT", () => {
    it("should create a new virtual account", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.create({
            validFor: 600,
            callbackUrl:
              "https://webhook.site/91558cc6-f879-45e8-af65-3a03a6d0cb86",
            settlementAccount: {
              bankCode: "999240",
              accountNumber: process.env.DEBIT_ACCOUNT_NUMBER,
            },
            amountControl: "UnderPayment",
            amount: 100,
            externalReference: `TXN_REF ${Math.floor(Math.random() * 1000000000)}`,
          }),
        )
        .then((response) => {
          virtual_account_id = response.data._id;
          return response;
        })
        .catch((error) => error);

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: 200,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });

    it("should fail to create an account with invalid data", async () => {
      const res = await accountInstance
        .then((sdk) => sdk.create({}))
        .then((response) => response)
        .catch((error) => error);

      expect(res.statusCode).toBe(400);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.anything(),
        error: expect.anything(),
        error_description: expect.anything(),
      });
    });
  });

  describe("GET VIRTUAL ACCOUNT", () => {
    it("should return status 400 if account ID is wrong", async () => {
      const res = await accountInstance
        .then((sdk) => sdk.account("67c667df762c4e002456410c"))
        .then((response) => response)
        .catch((error) => error);

      expect(res.statusCode).toBe(400);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.anything(),
        error: expect.anything(),
        error_description: expect.anything(),
      });
    });

    it("should return a virtual account", async () => {
      const res = await accountInstance
        .then((sdk) => sdk.account(virtual_account_id))
        .then((response) => response)
        .catch((error) => console.error(error));

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });
  });

  describe("GET VIRTUAL ACCOUNT TRANSFER STATUS", () => {
    it("should return transaction status for a virtual account", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.transaferStatus({
            sessionId: "999240260122054728412553592703",
          }),
        )
        .then((response) => response)
        .catch((error) => console.error(error));

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });
  });

  describe("GET VIRTUAL ACCOUNT TRANSACTION", () => {
    it("should return transaction for a virtual account", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.transaction({
            virtualAccountId: "6971b915bb628000247f576d",
          }),
        )
        .then((response) => response)
        .catch((error) => console.error(error));

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });
  });

  describe("UPDATE VIRTUAL ACCOUNT", () => {
    it("should update virtual account", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.update({
            account_id: virtual_account_id,
            callbackUrl:
              "https://webhook.site/91558cc6-f879-45e8-af65-3a03a6d0cb86",
          }),
        )
        .then((response) => response)
        .catch((error) => error);

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: 200,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });
  });

  describe("DELETE VIRTUAL ACCOUNT", () => {
    it("should delete virtual account", async () => {
      const res = await accountInstance
        .then((sdk) => sdk.delete(virtual_account_id))
        .then((response) => response)
        .catch((error) => console.error(error));

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
      });
    });
  });
});
