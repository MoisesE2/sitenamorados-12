
"use client";
import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        // If item is not in localStorage, set it with initialValue
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }

      // Attempt to parse as JSON
      try {
        return JSON.parse(item);
      } catch (parseError) {
        // If JSON.parse fails, specifically check for the 'theme' key and known legacy values
        if (key === 'theme' && (item === 'light' || item === 'dark')) {
          console.warn(`Found legacy theme value "${item}" for key "${key}". Auto-correcting and storing as JSON.`);
          // Auto-correct: store it as JSON and return the corrected value
          window.localStorage.setItem(key, JSON.stringify(item));
          return item as T; 
        }
        // For other keys or other non-JSON values, log the error and fallback
        console.error(`Error parsing localStorage key "${key}" as JSON. Raw value: "${item}". Error:`, parseError);
        // Fallback: set localStorage with initialValue and return it
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue; 
      }
    } catch (error) { // Catch errors from window.localStorage.getItem itself (e.g., security restrictions)
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Only update if the new value is different from the current one.
      if (JSON.stringify(valueToStore) !== JSON.stringify(storedValue)) {
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]); // initialValue is not strictly needed here if `value` func doesn't use it

  useEffect(() => {
    if (typeof window === 'undefined') {
        return;
    }
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key) {
            try {
                let newValueFromEvent: T;
                if (event.newValue === null) {
                    newValueFromEvent = initialValue;
                } else {
                    newValueFromEvent = JSON.parse(event.newValue);
                }

                if (JSON.stringify(newValueFromEvent) !== JSON.stringify(storedValue)) {
                    setStoredValue(newValueFromEvent);
                }
            } catch (error) {
                console.error(`Error parsing localStorage change for key "${key}":`, error);
                 // Fallback to initialValue if parsing new value fails, only if different
                if (JSON.stringify(initialValue) !== JSON.stringify(storedValue)) {
                    setStoredValue(initialValue);
                }
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, storedValue]); // Added storedValue to dependencies


  return [storedValue, setValue];
}

export default useLocalStorage;
