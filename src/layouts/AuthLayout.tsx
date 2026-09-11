import type { ReactNode } from 'react';
import logo from '@/assets/Logo.png';
import postPreview from '@/assets/login_page_post.svg';
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
          <img className={styles.heroLogo} src={logo} alt="Postgram" />
        </div>
        <div className={styles.heroCopy}>
          <h2 className={styles.heroHeadline}>Share what matters.</h2>
          <p className={styles.heroSubtext}>
            Connect with people, share your moments, and discover something new every day.
          </p>
        </div>
        <img className={styles.previewImage} src={postPreview} alt="" />
      </div>
    </div>
  );
}
