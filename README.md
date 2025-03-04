<div align="center">

<!--- FIXME: chnage below to name of your project! --->

# `Safe Haven NodeJS SDK`

<!--- FIXME: Write short catchy description/tagline of project --->

## Introduction

This SDK simplifies the integration of Safe Haven’s APIs into your application, offering a seamless way to handle authentication, account management, verification, transfers, beneficiaries, and more. This guide provides a detailed overview of the available methods and best practices for effective implementation.

</div>

## Table of Content

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Setup](#setup)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Requirements

- Safe Haven [OAuth2 Client ID](https://safehavenmfb.readme.io/reference/creating-an-app).
- Safe Haven [OAuth2 Client Assertion](https://safehavenmfb.readme.io/reference/signing-your-client-assertion).
- Node JS v18 or higher.

## Installation

```sh
npm install @specialman/safehaven
```

## Setup

When initialized, the SDK authenticates using OAuth2 client credentials to obtain an access token, refresh token, and an IBS Client ID. These credentials are automatically included in the request headers for secure communication with Safe Haven’s API.

```javascript
const safeHavenSDK = require("@specialman/safehaven");

const safe_haven = safeHavenSDK({
  client_id: process.env.CLIENT_ID,
  client_assertion: process.env.CLIENT_ASSERTION,
  env: "sandbox", // or "production"
})
  .then((sdk) => sdk)
  .catch((error) => {
    console.error("SDK Initialization Failed:", error);
  });
```

# Usage

1. [Responses](documentation/response.md)
2. [Authentication](documentation/authentication.md)
3. [Accounts](documentation/accounts.md)
4. [Verification](documentation/verification.md)
5. [Transfers](documentation/transfers.md)
6. [Beneficiaries](documentation/beneficiaries.md)

Refer to the Safe Haven [API Reference](https://safehavenmfb.readme.io/) for detailed information on the parameters and options available for each method or request.

## Contributing

We welcome community contributions to this project.

Please read our [Contributor Guide](CONTRIBUTING.md) for more information on how to get started.
Please also read our [Contributor Terms](CONTRIBUTING.md#contributor-terms) before you make any contributions.

### License

By contributing to this project, you agree that your contributions will be licensed under its [MIT license](/LICENSE).

Copyright (c) Special Man Global Solution LTD.
