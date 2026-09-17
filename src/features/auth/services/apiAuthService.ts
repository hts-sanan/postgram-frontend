import { config } from '@/app/config';
import { apiClient, setAuthToken } from '@/services/api/client';
import type { AuthService, LoginCredentials, SignupInput, Session } from '../types';
import type { AuthenticatedUser } from '@/types';

const SESSION_STORAGE_KEY = 'postgram.session';
const REFRESH_TOKEN_KEY = 'postgram.refreshToken';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface ProfileResponse {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bio: string | null;
  profilePictureUrl: string | null;
}

function resolveUrl(path: string | null): string | null {
  if (!path) return null;
  const origin = config.apiBaseUrl.replace(/\/api\/v1\/?$/, '');
  return `${origin}${path}`;
}

function toAuthenticatedUser(profile: ProfileResponse): AuthenticatedUser {
  return {
    id: profile.userId,
    username: profile.username,
    displayName: `${profile.firstName} ${profile.lastName}`.trim(),
    avatarUrl: resolveUrl(profile.profilePictureUrl),
    bio: profile.bio ?? '',
    birthDate: profile.dateOfBirth,
    email: `${profile.username}@postgram.example.com`,
  };
}

function persistSession(session: Session | null, refreshToken: string | null) {
  if (session && refreshToken) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

function readStoredSession(): Session | null {
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export const apiAuthService: AuthService = {
  async login({ username, password }: LoginCredentials) {
    const tokens = await apiClient.post<AuthTokens>('/auth/login', { username, password });
    setAuthToken(tokens.accessToken);
    const profile = await apiClient.get<ProfileResponse>('/profiles/me');
    const session: Session = { user: toAuthenticatedUser(profile), token: tokens.accessToken };
    persistSession(session, tokens.refreshToken);
    return session;
  },

  async signup({ username, password, firstName, lastName, birthDate }: SignupInput) {
    const tokens = await apiClient.post<AuthTokens>('/auth/signup', {
      username,
      password,
      firstName,
      lastName,
      dateOfBirth: birthDate,
    });

    setAuthToken(tokens.accessToken);

    const profile = await apiClient.get<ProfileResponse>('/profiles/me');

    const session: Session = {
      user: toAuthenticatedUser(profile),
      token: tokens.accessToken,
    };

    persistSession(session, tokens.refreshToken);
    return session;
  },

  async logout() {
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    try {
      if (refreshToken) await apiClient.post('/auth/logout', { refreshToken });
    } catch {
      // best-effort
    }
    persistSession(null, null);
    setAuthToken(null);
  },

  async getSession() {
    const session = readStoredSession();
    if (!session) return null;
    setAuthToken(session.token);
    try {
      const profile = await apiClient.get<ProfileResponse>('/profiles/me');
      return { user: toAuthenticatedUser(profile), token: session.token };
    } catch {
      persistSession(null, null);
      return null;
    }
  },
};
