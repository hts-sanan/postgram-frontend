import { useContext } from 'react';
import { CreatePostModalContext } from '@/store/CreatePostModalContext';

/** Access the Create Post modal's open/close state. Must be used within <CreatePostModalProvider>. */
export function useCreatePostModal() {
  const context = useContext(CreatePostModalContext);
  if (!context) {
    throw new Error('useCreatePostModal must be used within a CreatePostModalProvider');
  }
  return context;
}
