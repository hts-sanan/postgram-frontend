import { classNames } from '@/utils/classNames';
import { getInitials, getAvatarColorVar } from '@/utils/initials';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string | null;
  name: string;
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_PX: Record<NonNullable<AvatarProps['size']>, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 88,
};

export function Avatar({ src, name, id, size = 'md', className }: AvatarProps) {
  const dimension = SIZE_PX[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={classNames(styles.avatar, className)}
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  return (
    <span
      className={classNames(styles.avatar, styles.fallback, className)}
      style={{ width: dimension, height: dimension, backgroundColor: getAvatarColorVar(id) }}
      aria-label={name}
      role="img"
    >
      {getInitials(name)}
    </span>
  );
}
