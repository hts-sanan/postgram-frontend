import { CommentComposer, CommentItem } from '@/features/comments';
import { useComments } from '@/features/comments/hooks/useComments';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useAuth } from '@/features/auth';
import { useToast } from '@/store/ToastContext';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useEffect, useState } from 'react';
import styles from './CommentSection.module.css';

const PREVIEW_COUNT = 4;

interface CommentSectionProps {
  postId: string;
  /** Reports the live comment count once loaded, so the post's badge stays accurate after add/edit/delete. */
  onCountChange?: (count: number) => void;
}

/** Inline comment thread shown under an expanded post, matching the Figma "Comments" screens. */
export function CommentSection({ postId, onCountChange }: CommentSectionProps) {
  const { session } = useAuth();
  const { showToast } = useToast();
  const { state, addComment, editComment, removeComment } = useComments(postId, true);

  useEffect(() => {
    if (state.status === 'success') onCountChange?.(state.data.length);
  }, [state, onCountChange]);
  const [showAll, setShowAll] = useState(false);
  const { isOpen: isConfirmOpen, open: openConfirm, close: closeConfirm } = useDisclosure();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (commentId: string) => {
    setPendingDeleteId(commentId);
    openConfirm();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      await removeComment(pendingDeleteId);
      closeConfirm();
      showToast('Comment deleted.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete comment.', 'error');
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>Comments</h3>

      {session && (
        <CommentComposer onSubmit={(content) => addComment(session.user.id, content).then(() => undefined)} />
      )}

      {state.status === 'success' && state.data.length === 0 && (
        <EmptyState
          icon="💬"
          title="No comments yet"
          description="Be the first to share your thoughts on this post."
        />
      )}

      {state.status === 'success' &&
        (showAll ? state.data : state.data.slice(0, PREVIEW_COUNT)).map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwner={session?.user.id === comment.author.id}
            onEdit={(content) => editComment(comment.id, content).then(() => undefined)}
            onDeleteRequest={() => handleDeleteRequest(comment.id)}
          />
        ))}

      {state.status === 'success' && !showAll && state.data.length > PREVIEW_COUNT && (
        <button type="button" className={styles.seeAll} onClick={() => setShowAll(true)}>
          See All Comments →
        </button>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete comment?"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete comment"
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirm}
        isConfirming={isDeleting}
      />
    </div>
  );
}