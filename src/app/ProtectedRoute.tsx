import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants/routes';

/** Gates authenticated-only routes. Redirects to /login, preserving the intended destination. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return null;

  if (!session) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
