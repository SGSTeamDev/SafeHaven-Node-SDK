const safeHavenSDK = require("../app");

describe("TRANSFERS", () => {
  let transferInstance;

  beforeAll(() => {
    transferInstance = safeHavenSDK({
      client_id: process.env.CLIENT_ID,
      client_assertion: process.env.CLIENT_ASSERTION,
      env: "sandbox",
    })
      .then((sdk) => sdk.Transfer)
      .catch((error) => console.log(error));
  });

  describe("LIST TRANSFERS", () => {
    it("should list transfers successfully", async () => {
      const res = await transferInstance
        .then((sdk) =>
          sdk.list({
            accountId: "67c667df762c4e002456410b",
            page: 0,
            limit: 25,
            fromDate: "2025-03-03",
            toDate: "2025-12-31",
            type: "Inwards",
            status: "Completed",
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

  describe("LIST BANKS", () => {
    it("should retrieve bank list successfully", async () => {
      const res = await transferInstance
        .then((sdk) => sdk.banks())
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

  describe("ACCOUNT NAME ENQUIRY", () => {
    it("should return account details successfully", async () => {
      const res = await transferInstance
        .then((sdk) =>
          sdk.nameEnquiry({
            bankCode: "999240",
            accountNumber: "8026324865",
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

  describe("CREATE TRANSFER", () => {
    it("should initiate transfer successfully", async () => {
      const res = await transferInstance
        .then((sdk) =>
          sdk.create({
            nameEnquiryReference: "999240250304051549760447965596",
            debitAccountNumber: process.env.DEBIT_ACCOUNT_NUMBER,
            beneficiaryBankCode: "999240",
            beneficiaryAccountNumber: "8026324865",
            amount: 100.0,
            saveBeneficiary: false,
            paymentReference: `TRX_REF_${Math.floor(
              Math.random() * 1000000000
            )}`,
            narration: "Test Transfer",
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

    it("should fail if name enquiry reference is is wrong", async () => {
      const res = await transferInstance
        .then((sdk) =>
          sdk.create({
            nameEnquiryReference: "invalid",
            debitAccountNumber: process.env.DEBIT_ACCOUNT_NUMBER,
            beneficiaryBankCode: "999240",
            beneficiaryAccountNumber: "8026324865",
            amount: 100.0,
            saveBeneficiary: false,
            paymentReference: `TRX_REF_${Math.floor(
              Math.random() * 1000000000
            )}`,
            narration: "Test Transfer",
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

  describe("GET TRANSFER STATUS", () => {
    it("should retrieve transfer status successfully", async () => {
      const res = await transferInstance
        .then((sdk) =>
          sdk.status({
            sessionId: "999240250304052717387409727109",
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

  describe("LIST BENEFICIARIES", () => {
    it("should retrieve beneficiaries successfully", async () => {
      const res = await transferInstance
        .then((sdk) => sdk.beneficiaries())
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

  describe("DELETE BENEFICIARY", () => {
    it("should return error if beneficiary id is wrong", async () => {
      const res = await transferInstance
        .then((sdk) => sdk.deleteBeneficiary("67c696a1762c4e0024565168"))
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
