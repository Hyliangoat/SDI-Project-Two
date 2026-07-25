import { describe, expect, it } from 'vitest';
import { reservoirSample } from './reservoirSample';

function sequenceRandom(values) {
  let index = 0;
  return () => {
    const value = values[index] ?? 0.5;
    index += 1;
    return value;
  };
}

describe('reservoirSample', () => {
  it('returns a fixed-size unique sample without modifying the input', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const sample = reservoirSample(
      input,
      3,
      sequenceRandom([0.1, 0.9]),
    );

    expect(sample).toHaveLength(3);
    expect(new Set(sample).size).toBe(3);
    expect(input).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('rejects a sample larger than the available data', () => {
    expect(() => reservoirSample([1, 2], 3)).toThrow(RangeError);
  });
});