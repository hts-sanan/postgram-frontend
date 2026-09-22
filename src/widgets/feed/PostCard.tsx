import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PostOptionsMenu } from '@/features/posts/components/PostOptionsMenu';
import { useAuth } from '@/features/auth';
import { useToast } from '@/store/ToastContext';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { ROUTES } from '@/constants/routes';
import { CommentSection } from './CommentSection';
import type { Post } from '@/types';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string) => Promise<unknown>;
  onUpdate: (postId: string, content: string) => Promise<unknown>;
  onDelete: (postId: string) => Promise<unknown>;
}

export function PostCard({ post, onToggleLike, onUpdate, onDelete }: PostCardProps) {
  const { session } = useAuth();
  const { showToast } = useToast();
  const isOwner = session?.user.id === post.author.id;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liveCommentCount, setLiveCommentCount] = useState<number | null>(null);
  const [justCopied, setJustCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    setIsLiked(post.likedByCurrentUser);
    setLikeCount(post.likeCount);
  }, [post.likedByCurrentUser, post.likeCount]);

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      await onUpdate(post.id, draft);
      setIsEditing(false);
      showToast('Post updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update post.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(post.id);
      showToast('Post deleted.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete post.', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const handleToggleLike = async () => {
    if (isLiking) return;

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    const nextIsLiked = !previousIsLiked;

    setIsLiked(nextIsLiked);
    setLikeCount(previousLikeCount + (nextIsLiked ? 1 : -1));
    setIsLiking(true);

    try {
      await onToggleLike(post.id);
    } catch (err) {
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      showToast(err instanceof Error ? err.message : 'Could not update like.', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${ROUTES.home}?post=${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this link:', url);
    }
    setJustCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setJustCopied(false), 2000);
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.authorRow}>
          <Avatar src={post.author.avatarUrl} name={post.author.name ?? post.author.displayName} id={post.author.id} />
          <div>
            <span className={styles.authorName}>{post.author.name}</span>
  

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
        className={isLiked ? `${styles.engagementButton} ${styles.liked}` : styles.engagementButton}
        onClick={handleToggleLike}
        aria-pressed={isLiked}
        disabled={isLiking}
      >
        <img
          src={isLiked ? '/icon-like-active.svg' : '/icon-like.svg'}
          alt=""
          className={styles.engagementIcon}
        />
        {likeCount}
      </button>
<button type="button" className={styles.engagementButton} onClick={() => setCommentsOpen((prev) => !prev)}>
  <img src="/icon-comment.svg" alt="" className={styles.engagementIcon} />
  {liveCommentCount ?? post.commentCount}
</button>
<button
  type="button"
  className={`${styles.engagementButton} ${styles.shareButton}`}
  onClick={handleShare}
  aria-label={justCopied ? 'Link copied' : 'Share post'}
>
  <img src="/icon-share.svg" alt="" className={styles.engagementIcon} />
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