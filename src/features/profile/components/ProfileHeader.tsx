import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onUpdateBio: (bio: string) => Promise<void>;
}

const birthDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function ProfileHeader({ user, isOwnProfile, onUpdateBio }: ProfileHeaderProps) {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draft, setDraft] = useState(user.bio);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateBio(draft);
      setIsEditingBio(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.card}>
      <Avatar src={user.avatarUrl} name={user.displayName} id={user.id} size="xl" />
      <div className={styles.details}>
        <h1 className={styles.name}>{user.displayName}</h1>
        <p className={styles.username}>{user.username}</p>

        {isEditingBio ? (
          <div className={styles.bioForm}>
            <input
              className={styles.bioInput}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Edit bio"
            />
            <Button size="sm" onClick={handleSave} isLoading={isSaving}>
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsEditingBio(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            {user.bio && <p className={styles.bio}>{user.bio}</p>}
            {isOwnProfile && (
              <button type="button" className={styles.editBioButton} onClick={() => setIsEditingBio(true)}>
                ✏️ Edit Bio
              </button>
            )}
          </>
        )}

        {user.birthDate && (
          <p className={styles.birthDate}>🎂 Born {birthDateFormatter.format(new Date(user.birthDate))}</p>
        )}
      </div>
    </div>
  );
}
