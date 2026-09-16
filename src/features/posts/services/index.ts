import { config } from '@/app/config';
import { mockPostService } from './mockPostService';
import { apiPostService } from './apiPostService';
import type { PostService } from './postService';

export const postService: PostService = config.useMocks ? mockPostService : apiPostService;

export type { PostService } from './postService';
