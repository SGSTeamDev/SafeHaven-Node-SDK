require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const base = require("./lib/base");
const Auth = require("./services/auth");
const Account = require("./services/account");
const VirtualAccount = require("./services/virtualAccount");
const Verification = require("./services/verification");
const Transfer = require("./services/transfer");

module.exports = ({ client_id, client_assertion, env }) => {
  return Auth.init({ client_id, client_assertion, env }).then(
    async (auth_service) => {
      Object.setPrototypeOf(auth_service, Auth.prototype);

      const request = await base(auth_service);

      return {
        Auth: auth_service,
        Account: new Account(request),
        VirtualAccount: new VirtualAccount(request),
        Verification: new Verification(request),
        Transfer: new Transfer(request),
      };
    },
  );
};
