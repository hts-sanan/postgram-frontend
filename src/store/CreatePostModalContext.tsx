import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

export type CreatePostStep = 'compose' | 'photo-intake';

interface CreatePostModalContextValue {
  isOpen: boolean;
  initialStep: CreatePostStep;
  /** Bumped whenever a post is successfully created, so feeds know to refetch. */
  feedVersion: number;
  open: (step?: CreatePostStep) => void;
  close: () => void;
  notifyPostCreated: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CreatePostModalContext = createContext<CreatePostModalContextValue | undefined>(undefined);

/**
 * App-wide state for the Create Post modal. Mounted once (in AppLayout) so it
 * can be triggered from anywhere — sidebar, feed composer, profile page —
 * without each trigger needing to know about the modal itself.
 */
export function CreatePostModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialStep, setInitialStep] = useState<CreatePostStep>('compose');
  const [feedVersion, setFeedVersion] = useState(0);

  const open = useCallback((step: CreatePostStep = 'compose') => {
    setInitialStep(step);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const notifyPostCreated = useCallback(() => setFeedVersion((prev) => prev + 1), []);

  const value = useMemo(
    () => ({ isOpen, initialStep, feedVersion, open, close, notifyPostCreated }),
    [isOpen, initialStep, feedVersion, open, close, notifyPostCreated],
  );

  return <CreatePostModalContext.Provider value={value}>{children}</CreatePostModalContext.Provider>;
}
