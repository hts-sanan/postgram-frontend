import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import styles from './PostComposer.module.css';

/** The "Start a post" bar at the top of the feed/profile — opens the Create Post modal. */
export function PostComposer() {
  const { session } = useAuth();
  const { open: openCreatePost } = useCreatePostModal();

  if (!session) return null;

  return (
    <div className={styles.composer}>
      <div className={styles.row}>
        <Avatar src={session.user.avatarUrl} name={session.user.displayName} id={session.user.id} />
        <button type="button" className={styles.fakeInput} onClick={() => openCreatePost('compose')}>
          Start a post
        </button>
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" size="sm" onClick={() => openCreatePost('compose')}>
          📝 Write Post
        </Button>
        <Button variant="secondary" size="sm" onClick={() => openCreatePost('photo-intake')}>
          🖼 Photo
        </Button>
        <Button size="sm" onClick={() => openCreatePost('compose')}>
          Post
        </Button>
      </div>
    </div>
  );
}