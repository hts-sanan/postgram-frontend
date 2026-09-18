import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import { classNames } from '@/utils/classNames';
import styles from './Sidebar.module.css';

/** Left navigation rail: brand, primary create-post action, and section links. */
export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { open: openCreatePost } = useCreatePostModal();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <aside className={styles.sidebar}>
      <div>
           <div className={styles.brand}>
          <img src="/logo-dark.png" alt="Postgram" />
          </div>

        <Button  onClick={() => openCreatePost('compose')} className={styles.createButton}>
            <span className={styles.createIcon}>+</span> Create Post
        </Button>

        <p className={styles.sectionLabel}>Primary Section</p>
        <nav>
          <ul className={styles.navList}>
            <li>
              <NavLink
              to={ROUTES.home}
        
              className={({ isActive }) => classNames(styles.navLink, isActive && styles.navLinkActive)}
>
                {({ isActive }) => (
    <>
                <img src={isActive ? '/icon-home.png' : '/icon-home-inactive.png'} alt="" className={styles.navIcon} />
                  Home
                </>
              )}
</NavLink>
            </li>
            <li>
              <NavLink
                to={ROUTES.profile}
                className={({ isActive }) => classNames(styles.navLink, isActive && styles.navLinkActive)}
              >
                {({ isActive }) => (
                  <>
                    <img src={isActive ? '/icon-profile-active.png' : '/icon-profile.png'} alt="" className={styles.navIcon} />
                    Profile
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        <img src="/icon-logout.png" alt="" className={styles.navIcon} />
        Log Out
      </button>
    </aside>
  );
}
