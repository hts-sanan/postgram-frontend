import { useRef } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown';
import { useDisclosure } from '@/hooks/useDisclosure';

interface PostOptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

/** The "..." menu on a post the current user owns: Edit Post / Delete Post. */
export function PostOptionsMenu({ onEdit, onDelete }: PostOptionsMenuProps) {
  const { isOpen, toggle, close } = useDisclosure();
  const anchorRef = useRef<HTMLButtonElement>(null);

  const items: DropdownItem[] = [
    { label: 'Edit Post', onSelect: onEdit, icon: '✏️' },
    { label: 'Delete Post', onSelect: onDelete, icon: '🗑', tone: 'danger' },
  ];

  return (
    <>
      <IconButton ref={anchorRef} label="Post options" onClick={toggle}>
        ⋯
      </IconButton>
      <Dropdown isOpen={isOpen} onClose={close} items={items} anchorRef={anchorRef} />
    </>
  );
}
