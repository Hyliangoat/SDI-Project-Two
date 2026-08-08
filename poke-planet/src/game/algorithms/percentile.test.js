import { describe, expect, it } from "vitest";
import { percentileRank, scalePercentile } from "./percentile";

describe("percentile utilities", () => {
  it("uses binary search to calculate percentile rank", () => {
    const values = [10, 20, 30, 40, 50];

    expect(percentileRank(values, 10)).toBe(0.2);
    expect(percentileRank(values, 30)).toBe(0.6);
    expect(percentileRank(values, 50)).toBe(1);
  });

  it("maps a percentile into a bounded game-stat range", () => {
    expect(scalePercentile(0, 20, 80)).toBe(20);
    expect(scalePercentile(0.5, 20, 80)).toBe(50);
    expect(scalePercentile(1, 20, 80)).toBe(80);
  });
});
