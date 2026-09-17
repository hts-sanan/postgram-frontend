import type { ReactNode } from 'react';
import { AuthProvider } from '@/store/AuthContext';
import { CreatePostModalProvider } from '@/store/CreatePostModalContext';
import { ToastProvider } from '@/store/ToastContext';
import { ToastContainer } from '@/components/feedback/Toast';

/** Composition root for all app-wide context providers. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CreatePostModalProvider>{children}</CreatePostModalProvider>
      </AuthProvider>
      <ToastContainer />
    </ToastProvider>
  );
}
