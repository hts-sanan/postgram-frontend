import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants/routes';

/** Keeps signed-in users out of /login and /signup by bouncing them to the home feed. */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { session, isInitializing } = useAuth();

  if (isInitializing) return null;
  if (session) return <Navigate to={ROUTES.home} replace />;

  return <>{children}</>;
}
