import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Toggle.module.css';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({ label, className, ...rest }, ref) => (
  <label className={styles.wrapper}>
    <input ref={ref} type="checkbox" className={styles.input} {...rest} />
    <span className={styles.track}>
      <span className={styles.thumb} />
    </span>
    <span className={styles.label}>{label}</span>
  </label>
));

Toggle.displayName = 'Toggle';