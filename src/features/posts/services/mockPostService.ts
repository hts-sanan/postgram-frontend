import { simulateDelay, generateId } from '@/services/mocks/mockUtils';
import { mockPosts } from '@/services/mocks/data/posts';
import { mockUsers } from '@/services/mocks/data/users';
import type { CreatePostInput, Post, UpdatePostInput } from '@/types';
import type { PostService } from './postService';

// In-memory store seeded from mock data; resets on page reload, which is
// expected for a POC without a backend.
let posts: Post[] = [...mockPosts];

export const mockPostService: PostService = {
  async listPosts() {
    await simulateDelay();
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async listPostsByUser(userId: string) {
    await simulateDelay();
    return posts
      .filter((post) => post.author.id === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createPost(authorId, input: CreatePostInput) {
    await simulateDelay();
    const author = mockUsers.find((user) => user.id === authorId);
    if (!author) throw new Error('Unknown author.');

    const newPost: Post = {
      id: generateId('post'),
      author,
      content: input.content,
      images: (input.imageUrls ?? []).map((url, index) => ({
        id: generateId('img'),
        url,
        alt: `${author.displayName} post image ${index + 1}`,
      })),
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      likedByCurrentUser: false,
    };

    posts = [newPost, ...posts];
    return newPost;
  },

  async updatePost(postId, input: UpdatePostInput) {
    await simulateDelay();
    const existing = posts.find((post) => post.id === postId);
    if (!existing) throw new Error('Post not found.');
    const updated: Post = { ...existing, content: input.content };
    posts = posts.map((post) => (post.id === postId ? updated : post));
    return updated;
  },

  async deletePost(postId) {
    await simulateDelay();
    posts = posts.filter((post) => post.id !== postId);
  },

  async toggleLike(postId) {
    await simulateDelay(150);
    const existing = posts.find((post) => post.id === postId);
    if (!existing) throw new Error('Post not found.');
    const updated: Post = {
      ...existing,
      likedByCurrentUser: !existing.likedByCurrentUser,
      likeCount: existing.likedByCurrentUser ? existing.likeCount - 1 : existing.likeCount + 1,
    };
    posts = posts.map((post) => (post.id === postId ? updated : post));
    return updated;
  },
};
