import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '@/features/auth/services/authService';
import type { LoginCredentials, Session, SignupInput } from '@/features/auth/types';

interface AuthContextValue {
  session: Session | null;
  isInitializing: boolean;
  isAuthenticating: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    authService.getSession().then((existing) => {
      if (isMounted) {
        setSession(existing);
        setIsInitializing(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const newSession = await authService.login(credentials);
      setSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in right now.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const newSession = await authService.signup(input);
      setSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account right now.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({ session, isInitializing, isAuthenticating, error, login, signup, logout, clearError }),
    [session, isInitializing, isAuthenticating, error, login, signup, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
