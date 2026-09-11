import { useCallback, useEffect, useState } from 'react';
import { commentService } from '../services';
import type { AsyncState, Comment } from '@/types';

/** Loads comments for a single post on demand (feed only fetches them once expanded). */
export function useComments(postId: string, enabled: boolean) {
  const [state, setState] = useState<AsyncState<Comment[]>>({ status: 'idle' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = await commentService.listByPost(postId);
      setState({ status: 'success', data });
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err.message : 'Failed to load comments.' });
    }
  }, [postId]);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  const addComment = useCallback(
    async (authorId: string, content: string) => {
      const created = await commentService.create(authorId, { postId, content });
      setState((prev) => (prev.status === 'success' ? { status: 'success', data: [...prev.data, created] } : prev));
      return created;
    },
    [postId],
  );

  const editComment = useCallback(async (commentId: string, content: string) => {
    const updated = await commentService.update(commentId, content);
    setState((prev) =>
      prev.status === 'success'
        ? { status: 'success', data: prev.data.map((comment) => (comment.id === commentId ? updated : comment)) }
        : prev,
    );
    return updated;
  }, []);

  const removeComment = useCallback(async (commentId: string) => {
    await commentService.remove(commentId);
    setState((prev) =>
      prev.status === 'success'
        ? { status: 'success', data: prev.data.filter((comment) => comment.id !== commentId) }
        : prev,
    );
  }, []);

  return { state, reload: load, addComment, editComment, removeComment };
}
