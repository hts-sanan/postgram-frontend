import { config } from '@/app/config';
import { mockAuthService } from './mockAuthService';
import { apiAuthService } from './apiAuthService';
import type { AuthService } from '../types';

export const authService: AuthService = config.useMocks ? mockAuthService : apiAuthService;
