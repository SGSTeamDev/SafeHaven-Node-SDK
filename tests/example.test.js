/**
 * THIS SCRIPT SERVES AS A TEMPLATE
 *
 * IT IS NOT INCLUDED IN THE RUNNING TEST SUITES
 * SO IT WON'T BE PART OF THE REPORT
 * SEE 'jest.testPathIgnorePatterns' IN package.json
 *
 * HOW TO USE THIS TEMPLATE:
 * COPY THIS FILE AND RENAME COPIED FILE OR
 * COPY SCRIPTS IN THIS FILE TO ANOTHER FILE
 */

const app = require("../app");

describe("Transfer Service", () => {
  let transferInstance;

  beforeEach(() => {
    // process.env.KEY from env.test
    transferInstance = app(process.env.KEY).Transfer;
  });

  describe("Create Transfer Recipient", () => {
    it("should create a transfer recipient and return status as true", async () => {
      const res = await transferInstance.createTransferReceipient({
        type: "nuban",
        name: "Oguntolu Ayobami",
        account_number: "0164522849",
        bank_code: "058",
        currency: "NGN",
      });

      expect(res.status_code).toBe(201);
      expect(res).toMatchObject({
        status_code: res.status_code,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });

    it("should throw error createTransferReceipient fails", async () => {
      const data = {
        type: "nuban",
        name: "Oguntolu Ayobami",
        currency: "NGN",
      };

      await expect(
        transferInstance.createTransferReceipient(data)
      ).rejects.toThrow();

      await expect(
        transferInstance.createTransferReceipient(data)
      ).rejects.toMatchObject({
        status_code: expect.any(Number),
        message: expect.any(String),
      });
    });
  });

  describe("List Transfer Recipients", () => {
    it("should list transfer recipients and return status as true", async () => {
      const res = await transferInstance.listTransferReceipients({
        perPage: 10,
        page: 1,
      });

      expect(res.status_code).toBe(200);
      expect(res).toMatchObject({
        status_code: res.status_code,
        message: expect.any(String),
        data: expect.any(Array),
      });
    });
  });
});
