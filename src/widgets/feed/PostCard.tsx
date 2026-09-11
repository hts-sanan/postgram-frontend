import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PostOptionsMenu } from '@/features/posts/components/PostOptionsMenu';
import { useAuth } from '@/features/auth';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { ROUTES } from '@/constants/routes';
import { CommentSection } from './CommentSection';
import type { Post } from '@/types';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string) => void;
  // Accepts the hook's Promise<Post> return (or any Promise) — the card only awaits it.
  onUpdate: (postId: string, content: string) => Promise<unknown>;
  onDelete: (postId: string) => Promise<unknown>;
}

export function PostCard({ post, onToggleLike, onUpdate, onDelete }: PostCardProps) {
  const { session } = useAuth();
  const isOwner = session?.user.id === post.author.id;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liveCommentCount, setLiveCommentCount] = useState<number | null>(null);

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      await onUpdate(post.id, draft);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(post.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.authorRow}>
          <Avatar src={post.author.avatarUrl} name={post.author.displayName} id={post.author.id} />
          <div>
            <Link to={ROUTES.profile} className={styles.authorName}>
              {post.author.displayName}
            </Link>
            <span className={styles.username}>{post.author.username}</span>
          </div>
        </div>
        <div className={styles.metaRow}>
          {formatRelativeTime(post.createdAt)}
          {isOwner && (
            <PostOptionsMenu onEdit={() => setIsEditing(true)} onDelete={() => setIsDeleteOpen(true)} />
          )}
        </div>
      </header>

      {isEditing ? (
        <div className={styles.editForm}>
          <textarea
            className={styles.editTextarea}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Edit post"
          />
          <div className={styles.editActions}>
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit} isLoading={isSaving}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className={styles.content}>{post.content}</p>
      )}

      {post.images.length > 0 && (
        <div className={styles.imageWrapper}>
          <img src={post.images[activeImageIndex]!.url} alt={post.images[activeImageIndex]!.alt} className={styles.image} />
          {post.images.length > 1 && (
            <>
              <span className={styles.imageCounter}>
                {activeImageIndex + 1}/{post.images.length}
              </span>
              <div className={styles.imageDots}>
                {post.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    aria-label={`Show image ${index + 1}`}
                    className={index === activeImageIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot}
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className={styles.engagementRow}>
        <button
          type="button"
          className={post.likedByCurrentUser ? `${styles.engagementButton} ${styles.liked}` : styles.engagementButton}
          onClick={() => onToggleLike(post.id)}
          aria-pressed={post.likedByCurrentUser}
        >
          👍 {post.likeCount}
        </button>
        <button type="button" className={styles.engagementButton} onClick={() => setCommentsOpen((prev) => !prev)}>
          💬 {liveCommentCount ?? post.commentCount}
        </button>
        <button type="button" className={`${styles.engagementButton} ${styles.shareButton}`} aria-label="Share post">
          🔗
        </button>
      </div>

      {commentsOpen && <CommentSection postId={post.id} onCountChange={setLiveCommentCount} />}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete post?"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete post"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isConfirming={isDeleting}
      />
    </article>
  );
}
