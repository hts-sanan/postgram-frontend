import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import type { CreatePostStep } from '@/store/CreatePostModalContext';
import { useCreatePost } from '@/features/posts/hooks/useCreatePost';
import { PhotoIntakeStep } from './PhotoIntakeStep';
import { ComposeStep } from './ComposeStep';
import { SuccessStep } from './SuccessStep';

type InternalStep = CreatePostStep | 'success';

/**
 * Orchestrates the Create Post flow. Mounted once (see AppLayout) and driven
 * entirely by useCreatePostModal()/useCreatePost() — step components below
 * are presentational only.
 */
export function CreatePostModal() {
  const { isOpen, initialStep, close } = useCreatePostModal();
  const navigate = useNavigate();
  const { content, setContent, images, addImages, removeImage, canSubmit, isSubmitting, error, submit, reset } =
    useCreatePost();

  const [step, setStep] = useState<InternalStep>(initialStep);

  // Reset to the requested entry step every time the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialStep]);

  const handleDiscard = () => {
    close();
  };

  const handleSubmit = async () => {
    const post = await submit();
    if (post) setStep('success');
  };

  const handleViewPost = () => {
    close();
    navigate(ROUTES.home);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleDiscard} size="lg" labelledBy="create-post-title">
      {step === 'photo-intake' && (
        <PhotoIntakeStep
          onFilesSelected={(files) => {
            addImages(files);
            setStep('compose');
          }}
          onContinueWithoutPhoto={() => setStep('compose')}
        />
      )}

      {step === 'compose' && (
        <ComposeStep
          content={content}
          onContentChange={setContent}
          images={images}
          onAddImages={addImages}
          onRemoveImage={removeImage}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
          error={error}
          onDiscard={handleDiscard}
          onSubmit={handleSubmit}
        />
      )}

      {step === 'success' && <SuccessStep onViewPost={handleViewPost} onDone={close} />}
    </Modal>
  );
}
