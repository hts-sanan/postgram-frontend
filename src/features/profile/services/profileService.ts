import type { User } from '@/types';

export interface ProfileService {
  getUser(userId: string): Promise<User | null>;
  updateBio(userId: string, bio: string): Promise<User>;
  uploadAvatar(userId: string, file: File): Promise<User>;
  removeAvatar(userId: string): Promise<User>;
}
