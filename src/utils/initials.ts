/** Derives 1-2 letter initials from a display name, used as an avatar fallback. */
export function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return `${parts[0]!.slice(0, 1)}${parts[parts.length - 1]!.slice(0, 1)}`.toUpperCase();
}

const PALETTE_VARS = [
  '--color-avatar-bg-1',
  '--color-avatar-bg-2',
  '--color-avatar-bg-3',
  '--color-avatar-bg-4',
];

/** Deterministically maps an id to one of the avatar fallback background tokens. */
export function getAvatarColorVar(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return `var(${PALETTE_VARS[hash % PALETTE_VARS.length]})`;
}
