import { config } from '@/app/config';
import { mockPostService } from './mockPostService';
import type { PostService } from './postService';

export const postService: PostService = config.useMocks
  ? mockPostService
  : mockPostService; // TODO: replace with ApiPostService once the backend exists.

export type { PostService } from './postService';
