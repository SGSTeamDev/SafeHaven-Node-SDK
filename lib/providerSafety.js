function safeProviderText(value) {
  if (typeof value !== "string") return null;

  return value
    .slice(0, 500)
    .replace(/bearer\s+[^\s,]+/gi, "Bearer [REDACTED]")
    .replace(/(token|secret|password|otp|authorization|client_assertion|api[_-]?key|access[_-]?token)[=:]\s*[^\s,]+/gi, "$1=[REDACTED]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[REDACTED]")
    .replace(/\b\d{6,}\b/g, "[REDACTED]");
}

function safeProviderRequestId(value) {
  if (typeof value !== "string") return null;

  return value.slice(0, 128);
}

module.exports = { safeProviderText, safeProviderRequestId };
