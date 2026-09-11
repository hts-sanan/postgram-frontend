import { AppLayout } from '@/layouts/AppLayout';
import { PostComposer, usePosts } from '@/features/posts';
import { useAuth } from '@/features/auth';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import { FeedList } from '@/widgets/feed/FeedList';
import { ProfileSummaryCard } from '@/widgets/profile/ProfileSummaryCard';

export function HomePage() {
  const { session } = useAuth();
  const { feedVersion } = useCreatePostModal();
  const { state, toggleLike, updatePost, deletePost } = usePosts({ refreshKey: feedVersion });

  return (
    <AppLayout rightRail={session && <ProfileSummaryCard user={session.user} />}>
      <PostComposer />
      <FeedList
        state={state}
        onToggleLike={(postId) => void toggleLike(postId)}
        onUpdate={updatePost}
        onDelete={deletePost}
      />
    </AppLayout>
  );
}
