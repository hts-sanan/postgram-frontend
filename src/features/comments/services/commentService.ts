import type { Comment, CreateCommentInput } from '@/types';

export interface CommentService {
  listByPost(postId: string): Promise<Comment[]>;
  create(authorId: string, input: CreateCommentInput): Promise<Comment>;
  update(commentId: string, content: string): Promise<Comment>;
  remove(commentId: string): Promise<void>;
}
