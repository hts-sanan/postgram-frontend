import type { AuthenticatedUser } from '@/types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupInput {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface Session {
  user: AuthenticatedUser;
  token: string;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<Session>;
  signup(input: SignupInput): Promise<Session>;
  logout(): Promise<void>;
  getSession(): Promise<Session | null>;
}
