import { useState, type FormEvent } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
import { useToast } from '@/store/ToastContext';
import styles from './CommentComposer.module.css';

interface CommentComposerProps {
  onSubmit: (content: string) => Promise<void>;
}

export function CommentComposer({ onSubmit }: CommentComposerProps) {
  const { session } = useAuth();
  const { showToast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(content.trim());
      setContent('');
      showToast('Comment added.', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to post comment. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Avatar src={session.user.avatarUrl} name={session.user.displayName} id={session.user.id} size="sm" />
        <input
          className={styles.input}
          placeholder="Add a comment…"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          aria-label="Add a comment"
        />
        <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!content.trim()}>
        Sent <img src="/icon-sent.svg" alt="" className={styles.sendIcon} />
      </Button>
      </form>
      {error && <p style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{error}</p>}
    </>
  );
}