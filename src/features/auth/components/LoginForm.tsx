import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/store/ToastContext';
import styles from './LoginForm.module.css';
import { Toggle } from '@/components/ui/Toggle';

export function LoginForm() {
  const { login, isAuthenticating, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    try {
      await login({ username, password });
      showToast('Signed in successfully.', 'success');
      navigate(ROUTES.home, { replace: true });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Invalid username or password.', 'error');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Welcome back 👋</h1>
        <p className={styles.subtitle}>Sign in to continue sharing and connecting.</p>
      </div>

      <Input
        label="User Name"
        placeholder="Enter User Name"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="username"
        required
      />
      <Input
        label="Password"
        placeholder="Enter password"
        isPassword
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        required
      />

      <Toggle label="Remember me" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />

      {error && <p className={styles.formError}>{error}</p>}

      <Button type="submit" fullWidth isLoading={isAuthenticating}>
        Sign in
      </Button>

      <p className={styles.footer}>
        Dont have an account? <Link to={ROUTES.signup}>Sign up now</Link>
      </p>
    </form>
  );
}