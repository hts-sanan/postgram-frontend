import { useState, type FormEvent } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
import styles from './CommentComposer.module.css';

interface CommentComposerProps {
  onSubmit: (content: string) => Promise<void>;
}

export function CommentComposer({ onSubmit }: CommentComposerProps) {
  const { session } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        Sent ➤
      </Button>
    </form>
  );
}
