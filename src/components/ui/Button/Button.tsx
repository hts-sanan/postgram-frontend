import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { classNames } from '@/utils/classNames';
import { Spinner } from '@/components/feedback/Spinner/Spinner';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', isLoading = false, fullWidth = false, className, children, disabled, ...rest },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...rest}
      >
        {isLoading && <Spinner size="sm" />}
        <span className={isLoading ? styles.hiddenLabel : undefined}>{children}</span>
      </button>
    );
  },
);

Button.displayName = 'Button';
