import styles from './PostSkeleton.module.css';

/** Loading placeholder shown while the feed/comments are being fetched. */
export function PostSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.header}>
        <div className={styles.avatar} />
        <div className={styles.lines}>
          <div className={styles.lineShort} />
          <div className={styles.lineShorter} />
        </div>
      </div>
      <div className={styles.lineFull} />
      <div className={styles.lineFull} />
      <div className={styles.image} />
    </div>
  );
}
