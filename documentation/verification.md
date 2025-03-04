# Verification Methods

## Initiate Verification

Begins the verification process for a user.

```javascript
const initiateVerification = () => {
  safe_haven
    .then((sdk) =>
      sdk.Verification.initiate({
        type: "NIN",
        number: "22222222222",
        debitAccountNumber: "0123456789",
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Validate Verification

Completes the verification process.

```javascript
const validateVerification = () => {
  safe_haven
    .then((sdk) =>
      sdk.Verification.validate({
        identityId: "67c5d5ba6f78ac4c885abdfc",
        type: "NIN",
        otp: "123456",
      })
    )
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```
