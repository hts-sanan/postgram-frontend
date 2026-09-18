import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '@/features/auth/services/authService';
import type { LoginCredentials, Session, SignupInput } from '@/features/auth/types';
import type { User } from '@/types';
import { ApiError } from '@/services/api/client';

export interface AuthFieldErrors {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  form?: string;
}

interface AuthContextValue {
  session: Session | null;
  isInitializing: boolean;
  isAuthenticating: boolean;
  error: string | null;
  fieldErrors: AuthFieldErrors;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateSessionUser: (updates: Partial<User>) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getFieldErrors(error: unknown): AuthFieldErrors {
  if (!(error instanceof ApiError)) {
    return {
      form: error instanceof Error ? error.message : 'Unable to complete the request.',
    };
  }

  const fieldErrors: AuthFieldErrors = {};

  for (const message of error.messages) {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.startsWith('username ')) {
      fieldErrors.username ??= message;
      continue;
    }

    if (normalizedMessage.startsWith('password ')) {
      fieldErrors.password ??= message;
      continue;
    }

    if (normalizedMessage.startsWith('firstname ')) {
      fieldErrors.firstName ??= message;
      continue;
    }

    if (normalizedMessage.startsWith('lastname ')) {
      fieldErrors.lastName ??= message;
      continue;
    }

    if (normalizedMessage.startsWith('dateofbirth ')) {
      fieldErrors.birthDate ??= message;
      continue;
    }

    if (normalizedMessage.includes('username already exists')) {
      fieldErrors.username ??= message;
      continue;
    }
  }

  if (Object.keys(fieldErrors).length === 0) {
    fieldErrors.form = error.message;
  }

  return fieldErrors;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

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
    setFieldErrors({});

    try {
      const newSession = await authService.login(credentials);
      setSession(newSession);
    } catch (err) {
      const errors = getFieldErrors(err);
      setError(err instanceof Error ? err.message : 'Unable to sign in right now.');
      setFieldErrors(errors);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    setIsAuthenticating(true);
    setError(null);
    setFieldErrors({});

    try {
      const newSession = await authService.signup(input);
      setSession(newSession);
    } catch (err) {
      const errors = getFieldErrors(err);
      setError(err instanceof Error ? err.message : 'Unable to create your account right now.');
      setFieldErrors(errors);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  const updateSessionUser = useCallback((updates: Partial<User>) => {
    setSession((prev) =>
      prev ? { ...prev, user: { ...prev.user, ...updates } } : prev,
    );
  }, []);

  const value = useMemo(
    () => ({
      session,
      isInitializing,
      isAuthenticating,
      error,
      fieldErrors,
      login,
      signup,
      logout,
      clearError,
      updateSessionUser,
    }),
    [
      session,
      isInitializing,
      isAuthenticating,
      error,
      fieldErrors,
      login,
      signup,
      logout,
      clearError,
      updateSessionUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}