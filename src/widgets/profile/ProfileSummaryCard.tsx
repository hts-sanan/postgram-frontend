import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/constants/routes';
import type { User } from '@/types';
import styles from './ProfileSummaryCard.module.css';

const BIO_CHAR_LIMIT = 100;

function truncateBio(bio: string, limit = BIO_CHAR_LIMIT) {
  if (bio.length <= limit) return bio;
  return `${bio.slice(0, limit).trimEnd()}…`;
}

interface ProfileSummaryCardProps {
  user: User;
}

export function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  return (
    <div className={styles.card}>
      <Avatar src={user.avatarUrl} name={user.displayName} id={user.id} size="xl" className={styles.avatar} />
      <h3 className={styles.name}>{user.displayName}</h3>
      <p className={styles.username}>{user.username}</p>
      <div className={styles.bioBox}>
        {user.bio && <p className={styles.bio}>{truncateBio(user.bio)}</p>}
      </div>
      <Link to={ROUTES.profile} className={styles.link}>
        View Profile →
      </Link>
    </div>
  );
}