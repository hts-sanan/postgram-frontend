import { describe, expect, it } from 'vitest';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

describe('formatRelativeTime', () => {
  it('returns "Just now" for very recent timestamps', () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe('Just now');
  });

  it('formats minutes correctly', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m Ago');
  });

  it('formats days correctly', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoDaysAgo)).toBe('2d Ago');
  });

  it('formats weeks correctly', () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(oneWeekAgo)).toBe('1w Ago');
  });
});
