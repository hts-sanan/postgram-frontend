import type { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Two-column layout used by Login/Signup: the form on the left, and the
 * lavender hero panel with the Postgram pitch on the right (Figma source of truth).
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.formPane}>{children}</div>
      <div className={styles.heroPane}>
        <div className={styles.heroBrand}>
          <span className={styles.heroLogo} aria-hidden="true">
            🧑‍🤝‍🧑
          </span>
          <span className={styles.heroBrandName}>Postgram</span>
        </div>
        <h2 className={styles.heroHeadline}>Share what matters.</h2>
        <p className={styles.heroSubtext}>
          Connect with people, share your moments, and discover something new every day.
        </p>
        <div className={styles.previewCard} aria-hidden="true">
          <div className={styles.previewSearch}>Search…</div>
          <div className={styles.previewComposer}>Start a post</div>
        </div>
      </div>
    </div>
  );
}
