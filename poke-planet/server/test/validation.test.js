import test from "node:test";
import assert from "node:assert/strict";
import { parseCredentials, requireReward } from "../src/validation.js";

test("accepts valid credentials", () => {
  assert.deepEqual(
    parseCredentials({ username: "Jordan_01", password: "secure-pass-123" }),
    {
      username: "Jordan_01",
      password: "secure-pass-123",
    },
  );
});

test("rejects short passwords", () => {
  assert.throws(() =>
    parseCredentials({ username: "Jordan", password: "short" }),
  );
});

test("validates reward boundaries", () => {
  assert.deepEqual(requireReward({ amount: 100, campaignComplete: true }), {
    amount: 100,
    campaignComplete: true,
  });
  assert.throws(() => requireReward({ amount: 1001 }));
});
