import { IconButton } from '@/components/ui/IconButton';
import styles from './Topbar.module.css';

/** Top search bar + notifications bell, shown above the feed/profile content. */
export function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.searchWrapper}>
          <img src="/icon-search.svg" alt="" className={styles.searchIcon} />
        <input type="search" placeholder="Search…" className={styles.searchInput} aria-label="Search Postgram" />
      </div>
        <IconButton label="Notifications">
    <img src="/icon-notification.svg" alt="" className={styles.notificationIcon} />
  </IconButton>
    </header>
  );
}
