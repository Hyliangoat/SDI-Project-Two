import { describe, expect, it } from 'vitest';
import { BinaryMaxHeap } from './BinaryMaxHeap';

describe('BinaryMaxHeap', () => {
  it('extracts values from highest to lowest priority', () => {
    const heap = new BinaryMaxHeap((first, second) => first.priority - second.priority);

    heap.insert({ name: 'low', priority: 1 });
    heap.insert({ name: 'highest', priority: 10 });
    heap.insert({ name: 'middle', priority: 5 });

    expect(heap.extractMax().name).toBe('highest');
    expect(heap.extractMax().name).toBe('middle');
    expect(heap.extractMax().name).toBe('low');
    expect(heap.extractMax()).toBeNull();
  });

  it('does not mutate the heap when returning a sorted copy', () => {
    const heap = new BinaryMaxHeap();
    heap.insert(4).insert(9).insert(2);

    expect(heap.toSortedArray()).toEqual([9, 4, 2]);
    expect(heap.size).toBe(3);
    expect(heap.peek()).toBe(9);
  });
});