import { PostSkeleton } from '@/components/feedback/PostSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { PostCard } from './PostCard';
import type { AsyncState, Post } from '@/types';
import styles from './FeedList.module.css';

interface FeedListProps {
  state: AsyncState<Post[]>;
  onToggleLike: (postId: string) => Promise<unknown>;
  onUpdate: (postId: string, content: string) => Promise<unknown>;
  onDelete: (postId: string) => Promise<unknown>;
  onCreatePost?: () => void;
  emptyDescription?: string;
}

/** Renders the feed's loading / error / empty / success states, per the Figma "No posts yet" screen. */
export function FeedList({ state, onToggleLike, onUpdate, onDelete, onCreatePost, emptyDescription }: FeedListProps) {
  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <div className={styles.list}>
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <EmptyState
        icon="⚠️"
        title="Couldn't load posts"
        description={state.error}
        action={onCreatePost && <Button onClick={onCreatePost}>Try again</Button>}
      />
    );
  }

  if (state.data.length === 0) {
    return (
      <EmptyState
        icon="🖼"
        title="No posts yet"
        description={emptyDescription ?? 'Your feed is feeling a little quiet. Create a post and start the conversation.'}
        action={onCreatePost && <Button onClick={onCreatePost}>Create a post</Button>}
      />
    );
  }

  return (
    <div className={styles.list}>
      {state.data.map((post) => (
        <PostCard key={post.id} post={post} onToggleLike={onToggleLike} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
