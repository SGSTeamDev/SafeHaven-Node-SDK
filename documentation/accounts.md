# Accounts

## List Accounts

Retrieves a paginated list of accounts.

```javascript
const listAccounts = () => {
  safe_haven
    .then((sdk) =>
      sdk.Account.accounts({
        page: 0,
        limit: 100,
        isSubAccount: true,
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Get Account Details

Fetches details of a specific account.

```javascript
const getAccount = () => {
  safe_haven
    .then((sdk) => sdk.Account.account("67c66a90762c4e002456437"))
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Create Account

Creates a new account under the client profile.

```javascript
const createAccount = () => {
  safe_haven
    .then((sdk) =>
      sdk.Account.create({
        accountType: "Savings",
        suffix: `Wallet ${Math.floor(Math.random() * 1000000000)}`,
        metadata: {},
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Update Account

Updates an account under the client profile.

```javascript
const updateAccount = () => {
  safe_haven
    .then((sdk) =>
      sdk.Account.update({
        account_id: "67c05998ef955e0024ab381f",
        notificationSettings: {
          smsNotification: false,
          smsMonthlyStatement: false,
          emailNotification: true,
          emailMonthlyStatement: true,
        },
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Create Individual Sub-Account

Creates an individual sub-account.

```javascript
const createIndividualSubAccount = () => {
  safe_haven
    .then((sdk) =>
      sdk.Account.createSubAccount({
        phoneNumber: "+2348112345678",
        emailAddress: "jane.doe@yopmail.com",
        externalReference: `EXT_REF ${Math.floor(Math.random() * 1000000000)}`,
        identityType: "NIN",
        identityNumber: "22222222222",
        identityId: "67c5d5ba6f78ac4c885abdfc",
        otp: "123456",
        metadata: {
          test: true,
        },
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Update Sub-Account

Updates the details of a sub-account.

```javascript
const updateSubAccount = () => {
  safe_haven
    .then((sdk) =>
      sdk.Account.updateSubAccount({
        account_id: "67c667df762c4e002456410c",
        phoneNumber: "+2348112345679",
        emailAddress: "mat.doe@yopmail.com",
        externalReference: `EXT_REF ${Math.floor(Math.random() * 1000000000)}`,
        metadata: {
          updated: true,
        },
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## List Account Statement

Retrieves the transaction statement for a specified account.

```javascript
const listAccountStatement = () => {
  safe_haven
    .then((sdk) =>
      sdk.Account.statement({
        account_id: "67c05998ef955e0024ab381f",
        page: 0,
        limit: 25,
        fromDate: "2025-03-03",
        toDate: "2025-12-31",
        type: "Credit",
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```
