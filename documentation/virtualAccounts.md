# Virtual Accounts

## Create Virtual Account

Creates a time-based account.

```javascript
const createVirtualAccount = () => {
  safe_haven
    .then((sdk) =>
      sdk.VirtualAccount.create({
        validFor: 600,
        callbackUrl:
          "https://webhook.site/91558cc6-f879-45e8-af65-3a03a6d0cb86",
        settlementAccount: {
          bankCode: "999240",
          accountNumber: "0111321064",
        },
        amountControl: "UnderPayment",
        amount: 100,
        externalReference: `TXN_REF ${Math.floor(Math.random() * 1000000000)}`,
      }),
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Get Virtual Account

Fetches details of a specific virtul account.

```javascript
const getVirtualAccount = () => {
  safe_haven
    .then((sdk) => sdk.VirtualAccount.account("69928811bb628000348f484f"))
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Get Virtual Account Transfer Status

Returns the status of a transfer to virtual account.

```javascript
// sessionId = sessionId of transfer

const virtualAccountTransferStatus = () => {
  safe_haven
    .then((sdk) =>
      sdk.VirtualAccount.transaferStatus({
        sessionId: "999140261122022127924499186164",
      }),
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Get Virtual Account Transaction

Fetches details of a transfer to virtul account.

```javascript
const getVirtualAccountTransaction = () => {
  safe_haven
    .then((sdk) =>
      sdk.VirtualAccount.transaction({
        virtualAccountId: "69928811bb628000348f484f",
      }),
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Update Virtual Account

Updates the details of a virtual account.

```javascript
const updateVirtualAccount = () => {
  safe_haven
    .then((sdk) =>
      sdk.VirtualAccount.update({
        account_id: "69928811bb628000348f484f",
        callbackUrl:
          "https://webhook.site/91558cc6-f879-45e8-af65-3a03a6d0cb87",
      }),
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Delete Virtual Account

Deletes a virtual account.

```javascript
const deleteVirtualAccount = () => {
  safe_haven
    .then((sdk) => sdk.VirtualAccount.delete("69928811bb628000348f484f"))
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```
