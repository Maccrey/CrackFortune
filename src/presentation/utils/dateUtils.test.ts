import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getLocalDateString } from './dateUtils';

describe('getLocalDateString', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return date in YYYY-MM-DD format', () => {
    const date = new Date('2023-01-01T12:00:00');
    vi.setSystemTime(date);
    expect(getLocalDateString()).toBe('2023-01-01');
  });

  it('should handle single digit months and days correctly', () => {
    const date = new Date('2023-01-05T12:00:00');
    vi.setSystemTime(date);
    expect(getLocalDateString()).toBe('2023-01-05');
  });

  it('should reflect local time correctly (simulated by mocking Date behavior or relying on system timezone)', () => {
    // Note: Since we can't easily change the system timezone of the test runner environment in a portable way,
    // this test mainly verifies that it uses the Date object standard behavior which defaults to local time
    // unlike toISOString which is UTC.
    
    // We can verify it DOES NOT match toISOString slice if we pick a time that crosses the boundary.
    // However, we don't know the runner's timezone.
    // So we will just sanity check the format mostly.
    
    const now = new Date();
    const local = getLocalDateString();
    
    // Manual construction of what local string should be
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const expected = `${year}-${month}-${day}`;
    
    expect(local).toBe(expected);
  });
});
