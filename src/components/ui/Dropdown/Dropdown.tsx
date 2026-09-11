import { useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { classNames } from '@/utils/classNames';
import styles from './Dropdown.module.css';

export interface DropdownItem {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  tone?: 'default' | 'danger';
}

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownItem[];
  anchorRef: RefObject<HTMLElement>;
}

/**
 * Small options menu used for the "..." post menu and comment menu
 * (Edit / Delete). Positioned relative to its trigger via the anchor ref.
 */
export function Dropdown({ isOpen, onClose, items, anchorRef }: DropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, onClose, isOpen);

  if (!isOpen || !anchorRef.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();

  return createPortal(
    <div
      ref={menuRef}
      className={styles.menu}
      style={{ top: rect.bottom + window.scrollY + 6, left: rect.right + window.scrollX - 180 }}
      role="menu"
    >
      {items.map((item) => (
        <button
          key={item.label}
          role="menuitem"
          type="button"
          className={classNames(styles.item, item.tone === 'danger' && styles.danger)}
          onClick={() => {
            item.onSelect();
            onClose();
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>,
    document.body,
  );
}
