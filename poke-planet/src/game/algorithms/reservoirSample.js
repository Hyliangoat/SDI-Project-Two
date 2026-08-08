//Reservoir sampling algorithm implementation

function normalizeRandomValue(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0.5;
  }

  return Math.min(Math.max(numericValue, 0), 0.999999);
}

/*
Selects k unique items from a list of n items, where n is unknown or very large. The algorithm works by maintaining a "reservoir" of k items, which is initially 
filled with the first k items from the input list. As new items are encountered, they are randomly selected to replace items in the reservoir with decreasing probability as more items are seen. 
This ensures that each item has an equal chance of being included in the final sample. The algorithm is efficient in terms of both time and space complexity, as it only requires a single pass through the 
input list and uses a fixed amount of memory to store the reservoir. It is commonly used in streaming data applications, where the total number of items is unknown or too large to store in memory.
*/

export function reservoirSample(items, sampleSize, random = Math.random) {
  if (!Array.isArray(items)) {
    throw new TypeError("Reservoir sampling requires an array.");
  }

  if (!Number.isInteger(sampleSize) || sampleSize < 0) {
    throw new RangeError("Sample size must be a nonnegative integer.");
  }

  if (sampleSize > items.length) {
    throw new RangeError("Sample size cannot exceed the number of items.");
  }

  if (typeof random !== "function") {
    throw new TypeError("Random source must be a function.");
  }

  const reservoir = items.slice(0, sampleSize);

  for (let index = sampleSize; index < items.length; index += 1) {
    const randomValue = normalizeRandomValue(random());
    const replacementIndex = Math.floor(randomValue * (index + 1));

    if (replacementIndex < sampleSize) {
      reservoir[replacementIndex] = items[index];
    }
  }

  return reservoir;
}
