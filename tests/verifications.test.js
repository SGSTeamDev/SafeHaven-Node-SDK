const safeHavenSDK = require("../app");

describe("VERIFICATIONS", () => {
  let verificationInstance;

  beforeAll(() => {
    verificationInstance = safeHavenSDK({
      client_id: process.env.CLIENT_ID,
      client_assertion: process.env.CLIENT_ASSERTION,
      env: "sandbox",
    })
      .then((sdk) => sdk.Verification)
      .catch((error) => console.log(error));
  });

  describe("INITIATE VERIFICATION", () => {
    it("should initiate verification successfully", async () => {
      const res = await verificationInstance
        .then((sdk) =>
          sdk.initiate({
            type: "NIN",
            number: "22222222222",
            debitAccountNumber: process.env.DEBIT_ACCOUNT_NUMBER,
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

    it("should fail to initiate verification with invalid data", async () => {
      const res = await verificationInstance
        .then((sdk) =>
          sdk.initiate({
            type: "NIN",
            number: "",
            debitAccountNumber: "",
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

  describe("VALIDATE VERIFICATION", () => {
    it("should validate verification successfully", async () => {
      const res = await verificationInstance
        .then((sdk) =>
          sdk.validate({
            identityId: "67c5d5ba6f78ac4c885abdfb",
            type: "NIN",
            otp: "123456",
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

    it("should fail to validate verification with incorrect OTP", async () => {
      const res = await verificationInstance
        .then((sdk) =>
          sdk.validate({
            identityId: "67c5d5ba6f78ac4c885abdfc",
            type: "NIN",
            otp: "000000",
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
