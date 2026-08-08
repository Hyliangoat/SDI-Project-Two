import "dotenv/config";

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseOrigins() {
  const configuredOrigins =
    process.env.CLIENT_ORIGINS ??
    process.env.CLIENT_ORIGIN ??
    "http://localhost:5173";

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const config = Object.freeze({
  port: Number(process.env.PORT ?? 3001),

  databaseUrl: required("DATABASE_URL"),

  jwtSecret: required("JWT_SECRET"),

  clientOrigins: Object.freeze(parseOrigins()),
});
