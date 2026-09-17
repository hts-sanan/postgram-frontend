import { useRef, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { profileService } from '../services';
import { useToast } from '@/store/ToastContext';
import type { User } from '@/types';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onUpdateBio: (bio: string) => Promise<void>;
  onUserUpdate?: (user: User) => void;
}

const birthDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function ProfileHeader({ user, isOwnProfile, onUpdateBio, onUserUpdate }: ProfileHeaderProps) {
  const { showToast } = useToast();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draft, setDraft] = useState(user.bio);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateBio(draft);
      setIsEditingBio(false);
      showToast('Profile updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const updated = await profileService.uploadAvatar(user.id, file);
      onUserUpdate?.(updated);
      showToast('Profile picture updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not upload picture.', 'error');
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const updated = await profileService.removeAvatar(user.id);
      onUserUpdate?.(updated);
      showToast('Profile picture removed.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not remove picture.', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className={styles.card}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Avatar src={user.avatarUrl} name={user.displayName} id={user.id} size="xl" />
        {isOwnProfile && (
          <>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              style={{
                position: 'absolute', bottom: 0, right: user.avatarUrl ? 28 : 0, borderRadius: '50%',
                width: 28, height: 28, border: '2px solid white', background: '#6366f1',
                color: 'white', cursor: 'pointer', fontSize: 14,
              }}
              aria-label="Change profile picture"
            >
              {isUploadingAvatar ? '…' : '📷'}
            </button>
            {user.avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isUploadingAvatar}
                style={{
                  position: 'absolute', bottom: 0, right: 0, borderRadius: '50%',
                  width: 28, height: 28, border: '2px solid white', background: '#ef4444',
                  color: 'white', cursor: 'pointer', fontSize: 14,
                }}
                aria-label="Remove profile picture"
              >
                🗑
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </>
        )}
      </div>
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