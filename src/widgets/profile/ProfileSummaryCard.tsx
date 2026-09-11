import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/constants/routes';
import type { User } from '@/types';
import styles from './ProfileSummaryCard.module.css';

interface ProfileSummaryCardProps {
  user: User;
}

/** Right-rail card on the feed page: avatar, name, bio, and a link to the full profile. */
export function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  return (
    <div className={styles.card}>
      <Avatar src={user.avatarUrl} name={user.displayName} id={user.id} size="xl" className={styles.avatar} />
      <h3 className={styles.name}>{user.displayName}</h3>
      <p className={styles.username}>{user.username}</p>
      {user.bio && <p className={styles.bio}>{user.bio}</p>}
      <Link to={ROUTES.profile} className={styles.link}>
        View Profile →
      </Link>
    </div>
  );
}
