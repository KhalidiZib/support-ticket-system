import api from "./api";

// LOGIN (password-only OR password + 2FA code)
export async function loginRequest({ email, password, twoFactorCode }) {
  const payload = { email, password };
  if (twoFactorCode) payload.twoFactorCode = twoFactorCode;

  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function verify2FARequest(email, code) {
  const { data } = await api.post("/auth/verify-2fa", { email, code });
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function requestPasswordReset(email) {
  return api.post("/auth/password/reset/request", { email });
}

export async function confirmPasswordReset(token, newPassword) {
  return api.post("/auth/password/reset/confirm", { token, newPassword });
}

export async function verifyOtp(token) {
  return api.post("/auth/password/reset/verify", { token });
}

export async function get2faStatus() {
  const { data } = await api.get("/auth/2fa/status");
  return data;
}

export async function confirmEnableTwoFactor(code) {
  return api.post("/auth/2fa/confirm", { code });
}

export async function enableTwoFactor() {
  const { data } = await api.post("/auth/2fa/enable");
  return data;
}

export async function disableTwoFactor() {
  await api.post("/auth/2fa/disable");
}

// Registration
export async function registerCustomer(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}
