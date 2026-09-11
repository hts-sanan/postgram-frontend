import { simulateDelay, generateId } from '@/services/mocks/mockUtils';
import { mockComments } from '@/services/mocks/data/comments';
import { mockUsers } from '@/services/mocks/data/users';
import type { Comment, CreateCommentInput } from '@/types';
import type { CommentService } from './commentService';

let comments: Comment[] = [...mockComments];

export const mockCommentService: CommentService = {
  async listByPost(postId) {
    await simulateDelay(250);
    return comments
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async create(authorId, input: CreateCommentInput) {
    await simulateDelay(200);
    const author = mockUsers.find((user) => user.id === authorId);
    if (!author) throw new Error('Unknown author.');

    const newComment: Comment = {
      id: generateId('comment'),
      postId: input.postId,
      author,
      content: input.content,
      createdAt: new Date().toISOString(),
      editedAt: null,
    };
    comments = [...comments, newComment];
    return newComment;
  },

  async update(commentId, content) {
    await simulateDelay(200);
    const existing = comments.find((comment) => comment.id === commentId);
    if (!existing) throw new Error('Comment not found.');
    const updated: Comment = { ...existing, content, editedAt: new Date().toISOString() };
    comments = comments.map((comment) => (comment.id === commentId ? updated : comment));
    return updated;
  },

  async remove(commentId) {
    await simulateDelay(200);
    comments = comments.filter((comment) => comment.id !== commentId);
  },
};
