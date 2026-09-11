import type { DraftImage } from '@/features/posts/hooks/useCreatePost';
import styles from './ImagePreviewGrid.module.css';

interface ImagePreviewGridProps {
  images: DraftImage[];
  onRemove: (id: string) => void;
}

/** Thumbnail row for images attached to a draft post, each removable. */
export function ImagePreviewGrid({ images, onRemove }: ImagePreviewGridProps) {
  if (images.length === 0) return null;

  return (
    <div className={styles.grid}>
      {images.map((image) => (
        <div key={image.id} className={styles.thumb}>
          <img src={image.previewUrl} alt="" className={styles.image} />
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(image.id)}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
