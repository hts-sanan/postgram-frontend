import { useCallback, useState } from 'react';
import { postService } from '../services';
import { setPendingImageFile } from '../services/apiPostService';
import { config } from '@/app/config';
import { useAuth } from '@/features/auth';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import type { Post } from '@/types';

export interface DraftImage {
  id: string;
  file: File;
  previewUrl: string;
}

let draftImageCounter = 0;

export function useCreatePost() {
  const { session } = useAuth();
  const { notifyPostCreated } = useCreatePostModal();

  const [content, setContent] = useState('');
  const [images, setImages] = useState<DraftImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPost, setCreatedPost] = useState<Post | null>(null);

  const addImages = useCallback((files: File[]) => {
    const next = files.map((file) => {
      draftImageCounter += 1;
      return { id: `draft_img_${draftImageCounter}`, file, previewUrl: URL.createObjectURL(file) };
    });
    setImages((prev) => [...prev, ...next]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((image) => image.id !== id);
    });
  }, []);

  const canSubmit = content.trim().length > 0 || images.length > 0;

  const submit = useCallback(async () => {
    if (!session || !canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (!config.useMocks && images.length > 0) {
        // Real API stores a single image per post — only the first is sent.
        setPendingImageFile(images[0].file);
      }
      const post = await postService.createPost(session.user.id, {
        content: content.trim(),
        imageUrls: images.map((image) => image.previewUrl),
      });
      setCreatedPost(post);
      notifyPostCreated();
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish your post. Please try again.');
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  }, [session, canSubmit, content, images, notifyPostCreated]);

  const reset = useCallback(() => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setContent('');
    setImages([]);
    setError(null);
    setCreatedPost(null);
  }, [images]);

  return { content, setContent, images, addImages, removeImage, canSubmit, isSubmitting, error, createdPost, submit, reset };
}
