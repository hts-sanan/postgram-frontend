import { simulateDelay } from '@/services/mocks/mockUtils';
import { mockUsers } from '@/services/mocks/data/users';
import type { User } from '@/types';
import type { ProfileService } from './profileService';

let users: User[] = [...mockUsers];

export const mockProfileService: ProfileService = {
  async getUser(userId) {
    await simulateDelay(200);
    return users.find((user) => user.id === userId) ?? null;
  },

  async updateBio(userId, bio) {
    await simulateDelay();
    const existing = users.find((user) => user.id === userId);
    if (!existing) throw new Error('User not found.');
    const updated: User = { ...existing, bio };
    users = users.map((user) => (user.id === userId ? updated : user));
    return updated;
  },

  async uploadAvatar(userId, file) {
    await simulateDelay();
    const existing = users.find((user) => user.id === userId);
    if (!existing) throw new Error('User not found.');
    const updated: User = { ...existing, avatarUrl: URL.createObjectURL(file) };
    users = users.map((user) => (user.id === userId ? updated : user));
    return updated;
  },

  async removeAvatar(userId) {
    await simulateDelay();
    const existing = users.find((user) => user.id === userId);
    if (!existing) throw new Error('User not found.');
    const updated: User = { ...existing, avatarUrl: null };
    users = users.map((user) => (user.id === userId ? updated : user));
    return updated;
  },
};
