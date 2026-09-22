import { FileDropzone } from '@/components/ui/FileDropzone';
import styles from './PhotoIntakeStep.module.css';

interface PhotoIntakeStepProps {
  onFilesSelected: (files: File[]) => void;
  onContinueWithoutPhoto: () => void;
}

const UploadCloudIcon = <img src="/icon-upload.svg" alt="" width={56} height={56} />;

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
