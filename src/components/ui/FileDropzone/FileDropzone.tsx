import { useRef, useState, type ReactNode } from 'react';
import { classNames } from '@/utils/classNames';
import styles from './FileDropzone.module.css';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  icon?: ReactNode;
  title: string;
  primaryActionLabel: string;
  secondaryAction?: ReactNode;
}

/**
 * Generic drag-and-drop + click-to-browse file picker. Purely presentational —
 * callers decide what to do with the selected files.
 */
export function FileDropzone({
  onFilesSelected,
  accept = 'image/*',
  multiple = true,
  icon,
  title,
  primaryActionLabel,
  secondaryAction,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    onFilesSelected(Array.from(fileList));
  };

  return (
    <div
      className={classNames(styles.dropzone, isDragActive && styles.dropzoneActive)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragActive(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <p className={styles.title}>{title}</p>
      <button type="button" className={styles.primaryButton} onClick={() => inputRef.current?.click()}>
        {primaryActionLabel}
      </button>
      {secondaryAction}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className={styles.hiddenInput}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = '';
        }}
        aria-label={title}
      />
    </div>
  );
}
