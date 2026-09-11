import { config } from '@/app/config';
import { mockCommentService } from './mockCommentService';
import type { CommentService } from './commentService';

export const commentService: CommentService = config.useMocks
  ? mockCommentService
  : mockCommentService; // TODO: replace with ApiCommentService once the backend exists.

export type { CommentService } from './commentService';
