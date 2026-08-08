//sortedFiniteValues takes an array of records and a key, and returns a sorted array of finite values for that key. It first checks if the input is an array, then maps the records to their corresponding values for the specified key, filters out non-finite values, and finally sorts the remaining values in ascending order.
export function sortedFiniteValues(records, key) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map((record) => Number(record?.[key]))
    .filter(Number.isFinite)
    .sort((first, second) => first - second);
}

//percentileRank takes a sorted array of values and a value, and returns the percentile rank of that value within the array. It uses a binary search algorithm to find the index of the value in the sorted array, and then calculates the percentile rank as the index divided by the length of the array. If the input is not valid, it returns a fallback value.
export function percentileRank(sortedValues, value, fallback = 0.5) {
  if (!Array.isArray(sortedValues) || sortedValues.length === 0) {
    return fallback;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  let low = 0;
  let high = sortedValues.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);

    if (sortedValues[middle] <= numericValue) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  return Math.min(Math.max(low / sortedValues.length, 0), 1);
}

export function scalePercentile(percentile, minimum, maximum) {
  const boundedPercentile = Math.min(Math.max(Number(percentile) || 0, 0), 1);
  return Math.round(minimum + boundedPercentile * (maximum - minimum));
}
