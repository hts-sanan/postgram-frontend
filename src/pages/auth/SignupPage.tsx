import { AuthLayout } from '@/layouts/AuthLayout';
import { SignupForm } from '@/features/auth';

export function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
