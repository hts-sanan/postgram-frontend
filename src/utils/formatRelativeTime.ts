const UNITS: Array<{ limitSeconds: number; divisor: number; suffix: string }> = [
  { limitSeconds: 60, divisor: 1, suffix: 's Ago' },
  { limitSeconds: 3600, divisor: 60, suffix: 'm Ago' },
  { limitSeconds: 86400, divisor: 3600, suffix: 'h Ago' },
  { limitSeconds: 604800, divisor: 86400, suffix: 'd Ago' },
  { limitSeconds: 2629800, divisor: 604800, suffix: 'w Ago' },
  { limitSeconds: 31557600, divisor: 2629800, suffix: 'mo Ago' },
];

/** Formats an ISO date string as a short relative time, matching the Figma copy style ("1w Ago"). */
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const then = new Date(isoDate).getTime();
  const diffSeconds = Math.max(0, Math.round((now.getTime() - then) / 1000));

  if (diffSeconds < 10) return 'Just now';

  for (const unit of UNITS) {
    if (diffSeconds < unit.limitSeconds) {
      const value = Math.max(1, Math.floor(diffSeconds / unit.divisor));
      return `${value}${unit.suffix}`;
    }
  }

  const years = Math.floor(diffSeconds / 31557600);
  return `${years}y Ago`;
}
