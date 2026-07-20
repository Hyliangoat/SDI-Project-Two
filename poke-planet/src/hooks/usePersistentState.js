import { useEffect, useState } from 'react';

function readStoredValue(key, initialValue) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? initialValue : JSON.parse(storedValue);
  } catch (error) {
    console.warn(`Unable to read local storage key "${key}".`, error);
    return initialValue;
  }
}

export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue));

  useEffect(() => {
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Unable to write local storage key "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}