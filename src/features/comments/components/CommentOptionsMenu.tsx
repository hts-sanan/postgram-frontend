import { useRef } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown';
import { useDisclosure } from '@/hooks/useDisclosure';

interface CommentOptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

/** The "..." menu on a comment the current user owns: Edit Comment / Delete Comment. */
export function CommentOptionsMenu({ onEdit, onDelete }: CommentOptionsMenuProps) {
  const { isOpen, toggle, close } = useDisclosure();
  const anchorRef = useRef<HTMLButtonElement>(null);

  const items: DropdownItem[] = [
    { label: 'Edit Comment', onSelect: onEdit, icon: '✏️' },
    { label: 'Delete Comment', onSelect: onDelete, icon: '🗑', tone: 'danger' },
  ];

  return (
    <>
      <IconButton ref={anchorRef} label="Comment options" onClick={toggle}>
        ⋯
      </IconButton>
      <Dropdown isOpen={isOpen} onClose={close} items={items} anchorRef={anchorRef} />
    </>
  );
}
