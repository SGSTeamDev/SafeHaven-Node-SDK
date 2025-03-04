# Authentication

## Refresh Access Token

Refreshes the authentication token.

```javascript
const refreshAccessToken = () => {
  safe_haven
    .then((sdk) => sdk.Auth.refreshAccessToken())
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};
```
