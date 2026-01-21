const safeHavenSDK = require("../app");

describe("ACCOUNTS", () => {
  let accountInstance;

  beforeAll(() => {
    accountInstance = safeHavenSDK({
      client_id: process.env.CLIENT_ID,
      client_assertion: process.env.CLIENT_ASSERTION,
      env: "sandbox",
    })
      .then((sdk) => sdk.Account)
      .catch((error) => {
        console.log(error);
      });
  });

  describe("LIST ACCOUNTS", () => {
    it("should list sub accounts", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.accounts({
            page: 0,
            limit: 100,
            isSubAccount: true,
          })
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

  describe("GET ACCOUNT", () => {
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

    it("should return a sub accounts", async () => {
      const res = await accountInstance
        .then((sdk) => sdk.account("67c667df762c4e002456410b"))
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

  describe("CREATE ACCOUNT", () => {
    // commented out in order not to create more accounts
    // it("should create a new account", async () => {
    //   const res = await accountInstance
    //     .then((sdk) =>
    //       sdk.create({
    //         accountType: "Savings",
    //         suffix: `Wallet ${Math.floor(Math.random() * 1000)}`,
    //         metadata: {},
    //       })
    //     )
    //     .then((response) => response)
    //     .catch((error) => error);

    //   expect(res.statusCode).toBe(200);
    //   expect(res).toMatchObject({
    //     statusCode: 200,
    //     message: expect.any(String),
    //     data: expect.any(Object),
    //   });
    // });

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

  describe("UPDATE ACCOUNT", () => {
    it("should update an account", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.update({
            account_id: process.env.CLIENT_ACCOUNT_ID,
            notificationSettings: {
              smsNotification: false,
              smsMonthlyStatement: false,
              emailNotification: true,
              emailMonthlyStatement: true,
            },
          })
        )
        .then((response) => response)
        .catch((error) => error);

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });

    it("should fail to update with invalid account ID", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.update({
            account_id: "invalid_id",
            notificationSettings: {},
          })
        )
        .then((response) => response)
        .catch((error) => error);

      expect(res.statusCode).toBe(400);
      expect(res).toMatchObject({
        statusCode: 400,
        message: expect.anything(),
        error: expect.anything(),
        error_description: expect.anything(),
      });
    });
  });

  describe("CREATE SUB-ACCOUNT", () => {
    it("should create a new individual sub-account", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.createSubAccount({
            phoneNumber: "+2348112345678",
            emailAddress: "jane.doe@yopmail.com",
            externalReference: `EXT_REF ${Math.floor(
              Math.random() * 1000000000
            )}`,
            identityType: "NIN",
            identityNumber: "22222222222",
            identityId: "67c5d5ba6f78ac4c885abdfb",
            otp: "123456",
            metadata: { test: true },
          })
        )
        .then((response) => response)
        .catch((error) => error);

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });

    it("should fail to create a sub-account with missing fields", async () => {
      const res = await accountInstance
        .then((sdk) => sdk.createSubAccount({}))
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

  describe("UPDATE SUB-ACCOUNT", () => {
    it("should update an existing sub-account", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.updateSubAccount({
            account_id: "67c667df762c4e002456410b",
            phoneNumber: "+2348112345679",
            emailAddress: "mat.doe@yopmail.com",
            externalReference: `EXT_REF ${Math.floor(
              Math.random() * 1000000000
            )}`,
            metadata: { updated: true },
          })
        )
        .then((response) => response)
        .catch((error) => error);

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });

    it("should fail to update a non-existent sub-account", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.updateSubAccount({
            account_id: "invalid_id",
            metadata: { updated: false },
          })
        )
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

  describe("LIST ACCOUNT STATEMENT", () => {
    it("should retrieve account statement", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.statement({
            account_id: "67c667df762c4e002456410b",
            page: 0,
            limit: 25,
            fromDate: "2025-03-03",
            toDate: "2025-12-31",
            type: "Credit",
          })
        )
        .then((response) => response)
        .catch((error) => error);

      expect(res.statusCode).toBe(200);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });

    it("should fail to retrieve statement with invalid account ID", async () => {
      const res = await accountInstance
        .then((sdk) =>
          sdk.statement({
            account_id: "invalid_id",
            page: 0,
            limit: 25,
          })
        )
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
});
