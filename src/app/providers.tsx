import type { ReactNode } from 'react';
import { AuthProvider } from '@/store/AuthContext';
import { CreatePostModalProvider } from '@/store/CreatePostModalContext';

/** Composition root for all app-wide context providers. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CreatePostModalProvider>{children}</CreatePostModalProvider>
    </AuthProvider>
  );
}
