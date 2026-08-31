import { HushNote } from '../../types';

/**
 * Type guard for a single HushNote object.
 */
export function isHushNote(data: unknown): data is HushNote {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.username === 'string' &&
    (typeof obj.avatar === 'string' || obj.avatar === null || obj.avatar === undefined) &&
    typeof obj.text === 'string' &&
    typeof obj.timestamp === 'string'
  );
}

/**
 * Type guard for an array of HushNote objects.
 */
export function isHushNoteArray(data: unknown): data is HushNote[] {
  return Array.isArray(data) && data.every(isHushNote);
}

/**
 * Safely retrieves and parses JSON data from localStorage with validation and fallback.
 */
export function parseLocalStorage<T>(
  key: string,
  validator: (data: unknown) => data is T,
  defaultValue: T
): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (validator(parsed)) {
        return parsed;
      }
      console.warn(`localStorage key "${key}" failed type validation. Falling back to default.`);
    }
  } catch (error) {
    console.error(`Failed to parse localStorage key "${key}":`, error);
  }
  return defaultValue;
}

/**
 * Safely serializes and saves data to localStorage.
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage key "${key}":`, error);
  }
}
