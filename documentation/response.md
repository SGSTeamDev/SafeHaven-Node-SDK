# Responses

## Success Response Structure

```json
{
  "statusCode": 200,
  "message": "Example message",
  "data": { ... }
}
```

## Error Response Structure

```json
{
  "statusCode": 200,
  "message": "Example message",
  "error": ..., // any data type
  "error_description": ... // any data type
}
```

## Response Codes

| Code                               | Description                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| 200 OK                             | Everything worked as expected.                                                             |
| 400 Bad Request                    | The request was unacceptable, often due to missing a required parameter.                   |
| 401 Unauthorized                   | No valid API key was provided.                                                             |
| 402 Request Failed                 | The parameters were valid but the request failed.                                          |
| 403 Forbidden                      | The API key doesn't have permission to perform the request.                                |
| 404 Not Found                      | The requested resource doesn't exist.                                                      |
| 409 Conflict                       | The request conflicts with another request (perhaps due to using the same idempotent key). |
| 429 Too Many Requests              | Too many requests hit the API too quickly.                                                 |
| 500, 502, 503, 504 - Server Errors | Something went wrong on Safe Haven's end.                                                  |
