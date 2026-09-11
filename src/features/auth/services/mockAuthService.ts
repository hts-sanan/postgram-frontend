import { simulateDelay } from '@/services/mocks/mockUtils';
import { mockUsers, CURRENT_USER_ID } from '@/services/mocks/data/users';
import { setAuthToken } from '@/services/api/client';
import type { AuthService, LoginCredentials, SignupInput, Session } from '../types';

const SESSION_STORAGE_KEY = 'postgram.session';
const EXISTING_USERNAMES = new Set(mockUsers.map((user) => user.username.toLowerCase()));

function readStoredSession(): Session | null {
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function persistSession(session: Session | null): void {
  if (session) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export const mockAuthService: AuthService = {
  async login({ username, password }: LoginCredentials) {
    await simulateDelay();

    if (!password) {
      throw new Error('Enter your password to continue.');
    }

    const user = mockUsers.find((candidate) => candidate.username.toLowerCase() === username.toLowerCase());
    const baseUser = user ?? mockUsers.find((candidate) => candidate.id === CURRENT_USER_ID)!;

    const session: Session = {
      user: { ...baseUser, email: `${baseUser.username}@postgram.example.com` },
      token: `mock-token-${baseUser.id}`,
    };

    persistSession(session);
    setAuthToken(session.token);
    return session;
  },

  async signup({ username, password, birthDate }: SignupInput) {
    await simulateDelay();

    if (EXISTING_USERNAMES.has(username.toLowerCase())) {
      throw new Error('Username Already Exists');
    }
    if (!password) {
      throw new Error('Create a password to continue.');
    }

    const session: Session = {
      user: {
        id: `user_${username.toLowerCase()}`,
        username,
        displayName: username,
        avatarUrl: null,
        bio: '',
        birthDate,
        email: `${username}@postgram.example.com`,
      },
      token: `mock-token-${username}`,
    };

    persistSession(session);
    setAuthToken(session.token);
    return session;
  },

  async logout() {
    await simulateDelay(150);
    persistSession(null);
    setAuthToken(null);
  },

  async getSession() {
    const session = readStoredSession();
    if (session) setAuthToken(session.token);
    return session;
  },
};
