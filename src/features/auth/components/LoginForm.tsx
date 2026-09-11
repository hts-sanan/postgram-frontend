import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { login, isAuthenticating, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    try {
      await login({ username, password });
      navigate(ROUTES.home, { replace: true });
    } catch {
      // error state is already surfaced via useAuth()
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

      <label className={styles.rememberRow}>
        <input
          className={styles.toggleInput}
          type="checkbox"
          role="switch"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
        />
        <span className={styles.toggleTrack} aria-hidden="true" />
        <span>Remember me</span>
      </label>

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
