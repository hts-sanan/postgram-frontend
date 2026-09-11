import type { CreatePostInput, Post, UpdatePostInput } from '@/types';

/** Interface the UI depends on. A real ApiPostService can replace the mock with no UI changes. */
export interface PostService {
  listPosts(): Promise<Post[]>;
  listPostsByUser(userId: string): Promise<Post[]>;
  createPost(authorId: string, input: CreatePostInput): Promise<Post>;
  updatePost(postId: string, input: UpdatePostInput): Promise<Post>;
  deletePost(postId: string): Promise<void>;
  toggleLike(postId: string): Promise<Post>;
}
