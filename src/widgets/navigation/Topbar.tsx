import { IconButton } from '@/components/ui/IconButton';
import styles from './Topbar.module.css';

/** Top search bar + notifications bell, shown above the feed/profile content. */
export function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon} aria-hidden="true">
          🔍
        </span>
        <input type="search" placeholder="Search…" className={styles.searchInput} aria-label="Search Postgram" />
      </div>
      <IconButton label="Notifications">🔔</IconButton>
    </header>
  );
}
