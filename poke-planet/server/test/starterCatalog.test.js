import test from "node:test";
import assert from "node:assert/strict";
import { getStarter } from "../src/starterCatalog.js";

test("resolves starter IDs case-insensitively", () => {
  assert.equal(getStarter("Sol").id, "sol");
  assert.equal(getStarter("JUPITER").baseStats.defense, 70);
});

test("returns null for unknown starters", () => {
  assert.equal(getStarter("unknown"), null);
});
