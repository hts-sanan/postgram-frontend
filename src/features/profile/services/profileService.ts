import type { User } from '@/types';

export interface ProfileService {
  getUser(userId: string): Promise<User | null>;
  updateBio(userId: string, bio: string): Promise<User>;
}
