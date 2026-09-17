import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { useToast } from '@/store/ToastContext';
import { CommentOptionsMenu } from './CommentOptionsMenu';
import type { Comment } from '@/types';
import styles from './CommentItem.module.css';

interface CommentItemProps {
  comment: Comment;
  isOwner: boolean;
  onEdit: (content: string) => Promise<void>;
  onDeleteRequest: () => void;
}

export function CommentItem({ comment, isOwner, onEdit, onDeleteRequest }: CommentItemProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onEdit(draft);
      setIsEditing(false);
      showToast('Comment updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update comment.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.item}>
      <Avatar src={comment.author.avatarUrl} name={comment.author.displayName} id={comment.author.id} size="sm" />
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.authorRow}>
            <span className={styles.authorName}>{comment.author.displayName}</span>
            <span className={styles.username}>{comment.author.username}</span>
          </div>
          <div className={styles.meta}>
            {formatRelativeTime(comment.createdAt)}
            {comment.editedAt && ' (Edited)'}
            {isOwner && <CommentOptionsMenu onEdit={() => setIsEditing(true)} onDelete={onDeleteRequest} />}
          </div>
        </div>

        {isEditing ? (
          <div className={styles.editForm}>
            <input
              className={styles.editInput}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Edit comment"
            />
            <Button size="sm" onClick={handleSave} isLoading={isSaving}>
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <p className={styles.content}>{comment.content}</p>
        )}
      </div>
    </div>
  );
}