import { config } from '@/app/config';
import { mockCommentService } from './mockCommentService';
import { apiCommentService } from './apiCommentService';
import type { CommentService } from './commentService';

export const commentService: CommentService = config.useMocks ? mockCommentService : apiCommentService;

export type { CommentService } from './commentService';
