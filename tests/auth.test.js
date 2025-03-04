const safeHavenSDK = require("../app");

describe("AUTHENTICATION", () => {
  let authInstance;

  beforeAll(() => {
    authInstance = safeHavenSDK({
      client_id: process.env.CLIENT_ID,
      client_assertion: process.env.CLIENT_ASSERTION,
      env: "sandbox",
    })
      .then((sdk) => sdk.Auth)
      .catch((error) => {
        console.log(error);
      });
  });

  describe("Refresh Access Token", () => {
    it("should refresh access token", async () => {
      const res = await authInstance
        .then((sdk) => sdk.refreshAccessToken())
        .then((response) => response)
        .catch((error) => console.error(error));

      expect(res.statusCode).toBe(201);
      expect(res).toMatchObject({
        statusCode: res.statusCode,
        message: expect.any(String),
        data: expect.any(Object),
      });
    });
  });
});
