import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Sign in</Button>);
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Post</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Post' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables the button while loading', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
