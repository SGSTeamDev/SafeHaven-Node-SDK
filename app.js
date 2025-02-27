require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const base = require("./lib/base");

const Transfer = require("./services/transfer");

module.exports = (key) => {
  const request = base(key);

  return {
    Transfer: new Transfer(request),
  };
};
