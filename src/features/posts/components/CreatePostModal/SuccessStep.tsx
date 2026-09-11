import { Button } from '@/components/ui/Button';
import styles from './SuccessStep.module.css';

interface SuccessStepProps {
  onViewPost: () => void;
  onDone: () => void;
}

const CheckCircleIcon = (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <circle cx="12" cy="12" r="9.25" />
    <path d="m8 12.5 2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Confirmation shown after a post is successfully published. */
export function SuccessStep({ onViewPost, onDone }: SuccessStepProps) {
  return (
    <div>
      <div className={styles.banner}>
        <div className={styles.iconWrapper} aria-hidden="true">
          {CheckCircleIcon}
        </div>
        <h2 id="create-post-title" className={styles.title}>
          Post published!
        </h2>
        <p className={styles.description}>Your post has been successfully shared with the community.</p>
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onViewPost}>
          View post
        </Button>
        <Button onClick={onDone}>Done</Button>
      </div>
    </div>
  );
}
