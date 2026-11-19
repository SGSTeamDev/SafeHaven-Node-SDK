jest.mock("axios", () => jest.fn());

const axios = require("axios");
const base = require("../lib/base");

describe("PROVIDER ERROR PRESERVATION", () => {
  afterEach(() => jest.clearAllMocks());

  it("preserves Safe Haven error details and request IDs", async () => {
    axios.mockRejectedValueOnce({
      response: {
        status: 400,
        headers: { "x-request-id": "request-1" },
         data: {
           statusCode: 400,
           message: "Unable to create sub account.",
           error: "ACCOUNT_INVALID",
           error_description: "The identity is not valid.",
           accountNumber: "1234567890",
           authorization: "secret",
        },
      },
    });

    const request = base({
      base_url: "https://api.example.test",
      getAuthHeaders: jest.fn().mockResolvedValue({
        Authorization: "token",
        ClientID: "client",
      }),
    });

    let error;
    try {
      await request("/accounts/v2/subaccount", { method: "POST", data: {} });
    } catch (caught) {
      error = caught;
    }

    expect(error).toMatchObject({
      statusCode: 400,
      error: "ACCOUNT_INVALID",
      error_description: "The identity is not valid.",
      provider_response: {
        status_code: 400,
        request_id: "request-1",
        data: expect.objectContaining({ error: "ACCOUNT_INVALID" }),
      },
    });
    expect(error.message).toBe("Unable to create sub account.");
    expect(error.provider_response.data).not.toHaveProperty("accountNumber");
    expect(error.provider_response.data).not.toHaveProperty("authorization");
    expect(error.provider_response).not.toHaveProperty("headers");
  });

  it("redacts credentials and long numeric identifiers from provider text", async () => {
    axios.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          statusCode: 400,
          message: "Bearer provider-secret account 1234567890",
          error: "authorization=secret-value",
          error_description: "otp=123456",
        },
      },
    });

    const request = base({
      base_url: "https://api.example.test",
      getAuthHeaders: jest.fn().mockResolvedValue({
        Authorization: "token",
        ClientID: "client",
      }),
    });

    await expect(request("/accounts", { method: "GET" })).rejects.toMatchObject({
      message: "Bearer [REDACTED] account [REDACTED]",
      error: "authorization=[REDACTED]",
      error_description: "otp=[REDACTED]",
    });
  });

  it("promotes a provider request ID from the response body", async () => {
    axios.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          statusCode: 400,
          message: "Unable to create sub account.",
          requestId: "body-request-id",
        },
      },
    });

    const request = base({
      base_url: "https://api.example.test",
      getAuthHeaders: jest.fn().mockResolvedValue({
        Authorization: "token",
        ClientID: "client",
      }),
    });

    await expect(request("/accounts", { method: "POST", data: {} })).rejects.toMatchObject({
      provider_response: { request_id: "body-request-id" },
    });
  });
});
