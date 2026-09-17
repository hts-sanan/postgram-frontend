import { apiClient } from '@/services/api/client';
import type { Comment, CreateCommentInput } from '@/types';
import type { CommentService } from './commentService';

interface RawComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  replies?: RawComment[];
}

interface CommentsListResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  comments: RawComment[];
}

function toComment(raw: RawComment): Comment {
  const comment = {
    id: raw.id,
    postId: raw.postId,
    author: {
      id: raw.userId,
      username: raw.username,
      displayName: raw.username,
      avatarUrl: null,
      bio: '',
      birthDate: null,
    },
    content: raw.content ?? '',
    createdAt: raw.createdAt,
    editedAt: raw.updatedAt !== raw.createdAt ? raw.updatedAt : null,
  };

  console.log('API COMMENT MAPPED:', comment);

  return comment;
}

// Flattens top-level comments + their one level of replies into a single list,
// since the shared Comment type doesn't model threading yet.
function flatten(raw: RawComment[]): Comment[] {
  const result: Comment[] = [];
  for (const comment of raw) {
    result.push(toComment(comment));
    if (comment.replies) {
      result.push(...comment.replies.map(toComment));
    }
  }
  return result;
}

export const apiCommentService: CommentService = {
  async listByPost(postId) {
    const res = await apiClient.get<CommentsListResponse>(`/posts/${postId}/comments?limit=100`);
    return flatten(res.comments);
  },

  async create(_authorId, input: CreateCommentInput) {
    const raw = await apiClient.post<RawComment>(`/posts/${input.postId}/comments`, {
      content: input.content,
    });
    return toComment(raw);
  },

  async update(commentId, content) {
    const raw = await apiClient.patch<RawComment>(`/comments/${commentId}`, { content });
    return toComment(raw);
  },

  async remove(commentId) {
    await apiClient.delete(`/comments/${commentId}`);
  },
};
