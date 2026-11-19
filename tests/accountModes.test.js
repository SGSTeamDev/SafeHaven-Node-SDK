const Account = require("../services/account");
const { AppError } = require("../middleware/error");

describe("ACCOUNT OTP MODES", () => {
  it("sends a Safe Haven-compliant vID payload without an OTP", async () => {
    const request = jest.fn().mockResolvedValue({
      statusCode: 200,
      message: "Account Created Successfully.",
      data: { accountNumber: "0000000000" },
    });
    const account = new Account(request);

    await account.createSubAccount({
      phoneNumber: "+2348000000000",
      emailAddress: "user@example.com",
      externalReference: "ref-1",
      identityType: "BVN",
      identityId: "identity-1",
      otpMode: "bypass",
    });

    expect(request).toHaveBeenCalledWith("/accounts/v2/subaccount", {
      method: "POST",
      data: expect.objectContaining({
        identityType: "vID",
        identityId: "identity-1",
      }),
    });
    expect(request.mock.calls[0][1].data).not.toHaveProperty("otp");
    expect(request.mock.calls[0][1].data).not.toHaveProperty("otpMode");
  });

  it("rejects bypass mode without an identity ID", async () => {
    const account = new Account(jest.fn());

    await expect(
      account.createSubAccount({ otpMode: "bypass" }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "identityId is required when otpMode is bypass.",
    });
  });

  it("rejects an OTP combined with bypass mode", async () => {
    const account = new Account(jest.fn());

    await expect(
      account.createSubAccount({
        identityId: "identity-1",
        otp: "123456",
        otpMode: "bypass",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects an incomplete successful account response", async () => {
    const account = new Account(
      jest.fn().mockResolvedValue({ statusCode: 200, data: {} }),
    );

    await expect(
      account.createSubAccount({ identityType: "vID", identityId: "identity-1" }),
    ).rejects.toMatchObject({ statusCode: 502 });
  });
});
