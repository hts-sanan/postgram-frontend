import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/utils/classNames';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  /** Dialog width. Defaults to 'sm' (420px, the existing ConfirmDialog width). */
  size?: 'sm' | 'lg';
}

export function Modal({ isOpen, onClose, children, labelledBy, size = 'sm' }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={classNames(styles.dialog, size === 'lg' && styles.dialogLg)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
