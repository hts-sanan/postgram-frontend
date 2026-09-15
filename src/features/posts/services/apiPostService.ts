import { config } from '@/app/config';
import { apiClient } from '@/services/api/client';
import type { CreatePostInput, Post, UpdatePostInput, User } from '@/types';
import type { PostService } from './postService';

interface PostResponse {
  id: string;
  userId: string;
  postType: string;
  content: string | null;
  imageUrl: string | null;
  visibility: string;
  postStatus: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  hasLiked: boolean;
}

interface ProfileResponse {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
}

function resolveUrl(path: string | null): string | null {
  if (!path) return null;
  const origin = config.apiBaseUrl.replace(/\/api\/v1\/?$/, '');
  return `${origin}${path}`;
}

// Posts only return userId — fetch + cache each author's profile as needed.
const authorCache = new Map<string, User>();

async function getAuthor(userId: string): Promise<User> {
  const cached = authorCache.get(userId);
  if (cached) return cached;

  try {
    const profile = await apiClient.get<ProfileResponse>(`/profiles/${userId}`);
    const user: User = {
      id: profile.userId,
      username: profile.username,
      displayName: `${profile.firstName} ${profile.lastName}`.trim(),
      avatarUrl: resolveUrl(profile.profilePictureUrl),
      bio: '',
      birthDate: null,
    };
    authorCache.set(userId, user);
    return user;
  } catch {
    const fallback: User = {
      id: userId,
      username: 'unknown',
      displayName: 'Unknown user',
      avatarUrl: null,
      bio: '',
      birthDate: null,
    };
    return fallback;
  }
}

async function toPost(res: PostResponse): Promise<Post> {
  const author = await getAuthor(res.userId);
  return {
    id: res.id,
    author,
    content: res.content ?? '',
    images: res.imageUrl ? [{ id: `${res.id}_img`, url: resolveUrl(res.imageUrl)!, alt: '' }] : [],
    createdAt: res.createdAt,
    likeCount: res.likeCount,
    commentCount: res.commentCount,
    likedByCurrentUser: res.hasLiked,
  };
}

let pendingImageFile: File | null = null;
export function setPendingImageFile(file: File | null) {
  pendingImageFile = file;
}

export const apiPostService: PostService = {
  async listPosts() {
    const res = await apiClient.get<{ data: PostResponse[] }>('/posts');
    return Promise.all(res.data.map(toPost));
  },

  async listPostsByUser(userId) {
    // Backend has no authorId filter yet — fetch all and filter client-side.
    const res = await apiClient.get<{ data: PostResponse[] }>('/posts');
    const filtered = res.data.filter((post) => post.userId === userId);
    return Promise.all(filtered.map(toPost));
  },

  async createPost(_authorId, input: CreatePostInput) {
    const formData = new FormData();
    if (input.content) formData.append('content', input.content);
    if (pendingImageFile) formData.append('image', pendingImageFile);
    pendingImageFile = null;

    const res = await apiClient.postForm<PostResponse>('/posts', formData);
    return toPost(res);
  },

  async updatePost(postId, input: UpdatePostInput) {
    const res = await apiClient.patch<PostResponse>(`/posts/${postId}`, { content: input.content });
    return toPost(res);
  },

  async deletePost(postId) {
    await apiClient.delete(`/posts/${postId}`);
  },

  async toggleLike(postId) {
    const current = await apiClient.get<PostResponse>(`/posts/${postId}`);
    if (current.hasLiked) {
      await apiClient.delete(`/posts/${postId}/likes`);
    } else {
      await apiClient.post(`/posts/${postId}/likes`);
    }
    const updated = await apiClient.get<PostResponse>(`/posts/${postId}`);
    return toPost(updated);
  },
};
