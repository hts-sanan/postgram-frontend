import { config } from '@/app/config';
import { mockProfileService } from './mockProfileService';
import { apiProfileService } from './apiProfileService';
import type { ProfileService } from './profileService';

export const profileService: ProfileService = config.useMocks ? mockProfileService : apiProfileService;

export type { ProfileService } from './profileService';
