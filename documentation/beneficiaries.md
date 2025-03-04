# Beneficiaries

## List Beneficiaries

Retrieves a list of saved beneficiaries.

```javascript
const listBeneficiaries = () => {
  safe_haven
    .then((sdk) => sdk.Transfer.beneficiaries())
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```

## Delete Beneficiary

Removes a saved beneficiary.

```javascript
const deleteBeneficiary = () => {
  safe_haven
    .then((sdk) => sdk.Transfer.deleteBeneficiary("67c696a1762c4e0024565168"))
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```
