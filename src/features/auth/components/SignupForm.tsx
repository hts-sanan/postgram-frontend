import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginForm.module.css';

export function SignupForm() {
  const { signup, isAuthenticating, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    setConfirmError(null);

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      return;
    }

    try {
      await signup({ username, password, birthDate });
      navigate(ROUTES.home, { replace: true });
    } catch {
      // error state is already surfaced via useAuth()
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Join the community and start sharing.</p>
      </div>

      <Input
        label="User Name"
        placeholder="Enter a username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        error={error ?? undefined}
        autoComplete="username"
        required
      />
      <Input
        label="Date of birth"
        placeholder="DD / MM / YYYY"
        type="date"
        value={birthDate}
        onChange={(event) => setBirthDate(event.target.value)}
        required
      />
      <Input
        label="Password"
        placeholder="Create a password"
        isPassword
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
      />
      <Input
        label="Confirm password"
        placeholder="Re-enter your password"
        isPassword
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={confirmError ?? undefined}
        autoComplete="new-password"
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

      <Button type="submit" fullWidth isLoading={isAuthenticating}>
        Create account
      </Button>

      <p className={styles.footer}>
        Dont have an account? <Link to={ROUTES.signup}>Sign up now</Link>
      </p>
    </form>
  );
}
