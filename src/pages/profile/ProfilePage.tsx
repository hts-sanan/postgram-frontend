import { AppLayout } from '@/layouts/AppLayout';
import { ProfileHeader, profileService } from '@/features/profile';
import { usePosts } from '@/features/posts';
import { useAuth } from '@/features/auth';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import { FeedList } from '@/widgets/feed/FeedList';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import type { User } from '@/types';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { session } = useAuth();
  const { open: openCreatePost, feedVersion } = useCreatePostModal();
  const [user, setUser] = useState<User | null>(session?.user ?? null);
  const { state, toggleLike, updatePost, deletePost } = usePosts({ authorId: session?.user.id, refreshKey: feedVersion });

  useEffect(() => {
    if (!session) return;
    profileService.getUser(session.user.id).then(setUser);
  }, [session]);

  if (!session || !user) return null;

  return (
    <AppLayout>
      <ProfileHeader
        user={user}
        isOwnProfile
        onUpdateBio={async (bio) => {
          const updated = await profileService.updateBio(session.user.id, bio);
          setUser(updated);
        }}
      />

      <div className={styles.header}>
        <h2 className={styles.title}>My Posts</h2>
        <Button onClick={() => openCreatePost('compose')}>+ Create New Post</Button>
      </div>

      <FeedList
        state={state}
        onToggleLike={(postId) => void toggleLike(postId)}
        onUpdate={updatePost}
        onDelete={deletePost}
        onCreatePost={() => openCreatePost('compose')}
        emptyDescription="You haven't posted anything yet. Share your first moment."
      />
    </AppLayout>
  );
}
