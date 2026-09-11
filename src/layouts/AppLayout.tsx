import type { ReactNode } from 'react';
import { Sidebar } from '@/widgets/navigation/Sidebar';
import { Topbar } from '@/widgets/navigation/Topbar';
import { CreatePostModal } from '@/features/posts/components/CreatePostModal';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
  rightRail?: ReactNode;
}

/** Shell for all authenticated screens: sidebar + topbar + main content + optional right rail. */
export function AppLayout({ children, rightRail }: AppLayoutProps) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.mainColumn}>
        <Topbar />
        <div className={styles.contentRow}>
          <main className={styles.content}>{children}</main>
          {rightRail && <aside className={styles.rightRail}>{rightRail}</aside>}
        </div>
      </div>
      <CreatePostModal />
    </div>
  );
}
