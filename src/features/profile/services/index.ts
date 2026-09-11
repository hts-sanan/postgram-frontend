import { config } from '@/app/config';
import { mockProfileService } from './mockProfileService';
import type { ProfileService } from './profileService';

export const profileService: ProfileService = config.useMocks
  ? mockProfileService
  : mockProfileService; // TODO: replace with ApiProfileService once the backend exists.

export type { ProfileService } from './profileService';
