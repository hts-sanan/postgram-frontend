import { FileDropzone } from '@/components/ui/FileDropzone';
import styles from './PhotoIntakeStep.module.css';

interface PhotoIntakeStepProps {
  onFilesSelected: (files: File[]) => void;
  onContinueWithoutPhoto: () => void;
}

const UploadCloudIcon = (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M7 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.3 8.02 4 4 0 0 1 17 16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12v7m0-7 3 3m-3-3-3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** First step of the "Photo" post flow: drag-and-drop or browse, or skip straight to text. */
export function PhotoIntakeStep({ onFilesSelected, onContinueWithoutPhoto }: PhotoIntakeStepProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <h2 id="create-post-title" className={styles.title}>
          Create New Post
        </h2>
        <p className={styles.subtitle}>
          Share updates, achievements, or start a discussion with the alumni community.
        </p>
      </div>

      <FileDropzone
        icon={UploadCloudIcon}
        title="Drag photos here"
        primaryActionLabel="Select from Computer"
        onFilesSelected={onFilesSelected}
        secondaryAction={
          <button type="button" className={styles.continueButton} onClick={onContinueWithoutPhoto}>
            Continue without Photo
          </button>
        }
      />
    </div>
  );
}
