import type { User } from './user';

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  editedAt: string | null;
}

export interface CreateCommentInput {
  postId: string;
  content: string;
}
