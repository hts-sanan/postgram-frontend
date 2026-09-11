import { useCallback, useEffect, useState } from 'react';
import { postService } from '../services';
import type { Post } from '@/types';
import type { AsyncState } from '@/types';

interface UsePostsOptions {
  /** When provided, loads only that user's posts (profile page); otherwise the full feed. */
  authorId?: string;
  /** Bumping this (e.g. after a post is created elsewhere) triggers a refetch. */
  refreshKey?: unknown;
}

/** Loads posts and exposes create/update/delete/like actions that keep local state in sync. */
export function usePosts({ authorId, refreshKey }: UsePostsOptions = {}) {
  const [state, setState] = useState<AsyncState<Post[]>>({ status: 'idle' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = authorId ? await postService.listPostsByUser(authorId) : await postService.listPosts();
      setState({ status: 'success', data });
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err.message : 'Failed to load posts.' });
    }
  }, [authorId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const createPost = useCallback(
    async (creatorId: string, content: string, imageUrls?: string[]) => {
      const created = await postService.createPost(creatorId, { content, imageUrls });
      setState((prev) => (prev.status === 'success' ? { status: 'success', data: [created, ...prev.data] } : prev));
      return created;
    },
    [],
  );

  const updatePost = useCallback(async (postId: string, content: string) => {
    const updated = await postService.updatePost(postId, { content });
    setState((prev) =>
      prev.status === 'success'
        ? { status: 'success', data: prev.data.map((post) => (post.id === postId ? updated : post)) }
        : prev,
    );
    return updated;
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    await postService.deletePost(postId);
    setState((prev) =>
      prev.status === 'success' ? { status: 'success', data: prev.data.filter((post) => post.id !== postId) } : prev,
    );
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    const updated = await postService.toggleLike(postId);
    setState((prev) =>
      prev.status === 'success'
        ? { status: 'success', data: prev.data.map((post) => (post.id === postId ? updated : post)) }
        : prev,
    );
    return updated;
  }, []);

  return { state, reload: load, createPost, updatePost, deletePost, toggleLike };
}
