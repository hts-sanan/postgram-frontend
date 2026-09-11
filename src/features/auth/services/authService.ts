import { config } from '@/app/config';
import { mockAuthService } from './mockAuthService';
import type { AuthService } from '../types';

/**
 * Service resolution point: swap the mock for a real ApiAuthService here once
 * the backend is available. Nothing outside this file needs to change.
 */
export const authService: AuthService = config.useMocks
  ? mockAuthService
  : mockAuthService; // TODO: replace with ApiAuthService once the backend exists.
