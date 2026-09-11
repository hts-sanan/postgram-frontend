import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginForm } from '@/features/auth';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
