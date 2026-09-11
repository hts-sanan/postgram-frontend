import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { classNames } from '@/utils/classNames';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Renders a show/hide toggle for password fields, matching the login/signup Figma. */
  isPassword?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, isPassword, className, id, type, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [revealed, setRevealed] = useState(false);
    const resolvedType = isPassword ? (revealed ? 'text' : 'password') : type;

    return (
      <div className={classNames(styles.field, className)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={classNames(styles.input, error && styles.inputError)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              className={styles.revealButton}
              onClick={() => setRevealed((prev) => !prev)}
              aria-label={revealed ? 'Hide password' : 'Show password'}
            >
              {revealed ? '🙈' : '👁'}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.errorText}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
