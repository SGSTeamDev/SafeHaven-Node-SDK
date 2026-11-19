const Auth = require("../services/auth");

describe("AUTH PROVIDER ERRORS", () => {
  it("redacts sensitive provider text", () => {
    const auth = new Auth({ client_id: "client", client_assertion: "assertion" });
    const error = auth.handleError({
      response: {
        status: 401,
        data: {
          message: "Bearer provider-secret account 1234567890",
          error: "client_assertion=secret-value eyJheader.payload.signature",
        },
      },
    });

    expect(error).toMatchObject({
      message: "Bearer [REDACTED] account [REDACTED]",
      error: "client_assertion=[REDACTED] [REDACTED]",
    });
  });
});
