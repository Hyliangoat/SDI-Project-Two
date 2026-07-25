//Array backed binary max heap implementation
/*
This implementation allows for a custom comparator function to be provided, which can be used to determine 
the priority of the elements in the heap. By default, it uses a comparator that compares numbers in ascending order.
*/
export class BinaryMaxHeap {
  constructor(comparator = (first, second) => first - second) {
    if (typeof comparator !== 'function') {
      throw new TypeError('BinaryMaxHeap requires a comparator function.');
    }

    this.items = [];
    this.comparator = comparator;
  }

  get size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  peek() {
    return this.items[0] ?? null;
  }

  insert(value) {
    this.items.push(value);
    this.#bubbleUp(this.items.length - 1);
    return this;
  }

  extractMax() {
    if (this.items.length === 0) {
      return null;
    }

    if (this.items.length === 1) {
      return this.items.pop();
    }

    const maximum = this.items[0];
    this.items[0] = this.items.pop();
    this.#bubbleDown(0);
    return maximum;
  }

  toSortedArray() {
    const copy = new BinaryMaxHeap(this.comparator);
    copy.items = [...this.items];

    const sorted = [];
    while (!copy.isEmpty()) {
      sorted.push(copy.extractMax());
    }

    return sorted;
  }

  #bubbleUp(startIndex) {
    let childIndex = startIndex;

    while (childIndex > 0) {
      const parentIndex = Math.floor((childIndex - 1) / 2);
      const child = this.items[childIndex];
      const parent = this.items[parentIndex];

      if (this.comparator(child, parent) <= 0) {
        break;
      }

      [this.items[parentIndex], this.items[childIndex]] = [child, parent];
      childIndex = parentIndex;
    }
  }

  #bubbleDown(startIndex) {
    let parentIndex = startIndex;

    while (true) {
      const leftIndex = parentIndex * 2 + 1;
      const rightIndex = leftIndex + 1;
      let highestPriorityIndex = parentIndex;

      if (
        leftIndex < this.items.length
        && this.comparator(
          this.items[leftIndex],
          this.items[highestPriorityIndex],
        ) > 0
      ) {
        highestPriorityIndex = leftIndex;
      }

      if (
        rightIndex < this.items.length
        && this.comparator(
          this.items[rightIndex],
          this.items[highestPriorityIndex],
        ) > 0
      ) {
        highestPriorityIndex = rightIndex;
      }

      if (highestPriorityIndex === parentIndex) {
        break;
      }

      [this.items[parentIndex], this.items[highestPriorityIndex]] = [
        this.items[highestPriorityIndex],
        this.items[parentIndex],
      ];
      parentIndex = highestPriorityIndex;
    }
  }
}