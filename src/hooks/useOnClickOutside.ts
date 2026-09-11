import { useEffect, type RefObject } from 'react';

/** Invokes the handler when a pointer event occurs outside the given ref's element. */
export function useOnClickOutside(ref: RefObject<HTMLElement>, handler: () => void, active = true): void {
  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler, active]);
}
