# Transfers

## List Transfers

Fetches a list of transfers.

```javascript
const listTransfers = () => {
  safe_haven
    .then((sdk) =>
      sdk.Transfer.list({
        accountId: "67c667df762c4e002456411b",
        page: 0,
        limit: 25,
        fromDate: "2025-03-03",
        toDate: "2025-12-31",
        type: "Inwards",
        status: "Completed",
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## List Banks

Fetches the list of all banks in Nigeria.

```javascript
const listBanks = () => {
  safe_haven
    .then((sdk) => sdk.Transfer.banks())
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Account Name Enquiry

Fetches the name associated with a given bank account number.

```javascript
const accountNameEnquiry = () => {
  safe_haven
    .then((sdk) =>
      sdk.Transfer.nameEnquiry({
        bankCode: "999240",
        accountNumber: "8136325765",
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Make a Transfer

Initiates a transfer to another account.

```javascript
const transfer = () => {
  safe_haven
    .then((sdk) =>
      sdk.Transfer.create({
        nameEnquiryReference: "999240250304051549760447965596",
        debitAccountNumber: "0114127694",
        beneficiaryBankCode: "999240",
        beneficiaryAccountNumber: "8126424265",
        amount: 100.0,
        saveBeneficiary: false,
        paymentReference: `TXN_REF ${Math.floor(Math.random() * 1000000000)}`,
        narration: "Test Transfer",
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Get Transfer Status

Returns the status of a transfer.

```javascript
const getTransferStatus = () => {
  safe_haven
    .then((sdk) =>
      sdk.Transfer.status({
        sessionId: "999240250304052717387409727109",
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```
