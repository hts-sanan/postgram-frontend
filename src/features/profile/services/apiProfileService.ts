import { config } from '@/app/config';
import { apiClient } from '@/services/api/client';
import type { User } from '@/types';
import type { ProfileService } from './profileService';

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

function toUser(profile: ProfileResponse): User {
  return {
    id: profile.userId,
    username: profile.username,
    displayName: `${profile.firstName} ${profile.lastName}`.trim(),
    avatarUrl: resolveUrl(profile.profilePictureUrl),
    bio: profile.bio ?? '',
    birthDate: profile.dateOfBirth,
  };
}

export const apiProfileService: ProfileService = {
  async getUser(userId) {
    try {
      const profile = await apiClient.get<ProfileResponse>(`/profiles/${userId}`);
      return toUser(profile);
    } catch {
      return null;
    }
  },

  async updateBio(_userId, bio) {
    const profile = await apiClient.patch<ProfileResponse>('/profiles/me', { bio });
    return toUser(profile);
  },

  async uploadAvatar(_userId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const profile = await apiClient.postForm<ProfileResponse>('/profiles/me/picture', formData);
    return toUser(profile);
  },

  async removeAvatar(_userId) {
    const profile = await apiClient.delete<ProfileResponse>('/profiles/me/picture');
    return toUser(profile);
  },
};
