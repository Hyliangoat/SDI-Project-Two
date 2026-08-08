import { HttpError } from "./errors.js";

export function parseCredentials(body) {
  const username =
    typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^[a-zA-Z0-9_-]{3,40}$/.test(username))
    throw new HttpError(
      400,
      "Username must be 3-40 letters, numbers, underscores, or hyphens.",
    );
  if (password.length < 10 || password.length > 100)
    throw new HttpError(400, "Password must be 10-100 characters.");
  return { username, password };
}

export function requireString(value, name) {
  if (typeof value !== "string" || value.trim() === "")
    throw new HttpError(400, `${name} is required.`);
  return value.trim();
}

export function requireUrl(value, name) {
  const text = requireString(value, name);
  try {
    return new URL(text).toString();
  } catch {
    throw new HttpError(400, `${name} must be a valid URL.`);
  }
}

export function requireReward(body) {
  const amount = Number(body?.amount);
  if (!Number.isInteger(amount) || amount < 1 || amount > 1000)
    throw new HttpError(
      400,
      "Reward amount must be an integer from 1 to 1000.",
    );
  return { amount, campaignComplete: body?.campaignComplete === true };
}
