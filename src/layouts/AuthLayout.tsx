import type { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Two-column layout used by Login/Signup.
 * The left side contains the form, while the right side
 * contains the rounded gradient hero panel.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.formPane}>{children}</div>

      <div className={styles.heroPane}>
        <div className={styles.heroBrand}>
          <img
          className={styles.heroLogo}
          src="/logo.png"
          alt="Postgram"
          />
        </div>

        <h2 className={styles.heroHeadline}>Share what<br/>matters.</h2>

        <p className={styles.heroSubtext}>
          Connect with people, share your moments, and discover something new
          every day.
        </p>

        <div className={styles.previewCard} aria-hidden="true">
          <img
            className={styles.previewPostImage}
            src="/dashboard.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}