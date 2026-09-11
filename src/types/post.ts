import type { User } from './user';

export interface PostImage {
  id: string;
  url: string;
  alt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images: PostImage[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
}

export interface CreatePostInput {
  content: string;
  imageUrls?: string[];
}

export interface UpdatePostInput {
  content: string;
}
