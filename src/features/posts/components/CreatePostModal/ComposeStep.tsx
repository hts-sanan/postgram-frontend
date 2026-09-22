import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import type { DraftImage } from '@/features/posts/hooks/useCreatePost';
import { ImagePreviewGrid } from './ImagePreviewGrid';
import styles from './ComposeStep.module.css';

interface ComposeStepProps {
  content: string;
  onContentChange: (value: string) => void;
  images: DraftImage[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  error: string | null;
  onDiscard: () => void;
  onSubmit: () => void;
}

/** The main "Create new post" editor: text, attached photos, discard/post actions. */
export function ComposeStep({
  content,
  onContentChange,
  images,
  onAddImages,
  onRemoveImage,
  canSubmit,
  isSubmitting,
  error,
  onDiscard,
  onSubmit,
}: ComposeStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.wrapper}>
      <h2 id="create-post-title" className={styles.title}>
        Create new post
      </h2>

      <textarea
        className={styles.textarea}
        placeholder="What would you like to share with the community?"
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
        aria-label="Post content"
        autoFocus
      />

      <ImagePreviewGrid images={images} onRemove={onRemoveImage} />

      <div className={styles.attachRow}>
        <button type="button" className={styles.attachButton} onClick={() => fileInputRef.current?.click()}>
  <img src="/icon-attach-photo.svg" alt="" className={styles.attachIcon} />
  {images.length > 0 ? 'Add Photos' : 'Attach Photos'}
</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenInput}
          onChange={(event) => {
            if (event.target.files) onAddImages(Array.from(event.target.files));
            event.target.value = '';
          }}
          aria-label="Attach photos"
        />
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.footer}>
        <Button variant="secondary" onClick={onDiscard} disabled={isSubmitting}>
          Discard
        </Button>
        <Button onClick={onSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
          Post →
        </Button>
      </div>
    </div>
  );
}
