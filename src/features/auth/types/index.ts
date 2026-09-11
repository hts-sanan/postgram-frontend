import type { AuthenticatedUser } from '@/types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupInput {
  username: string;
  password: string;
  birthDate: string;
}

export interface Session {
  user: AuthenticatedUser;
  token: string;
}

/**
 * Auth is behind an interface so the mock implementation can be swapped for a
 * real backend-backed implementation later with no changes to the UI layer.
 */
export interface AuthService {
  login(credentials: LoginCredentials): Promise<Session>;
  signup(input: SignupInput): Promise<Session>;
  logout(): Promise<void>;
  getSession(): Promise<Session | null>;
}
