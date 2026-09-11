import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <EmptyState
        icon="🔍"
        title="Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        action={
          <Link to={ROUTES.home}>
            <Button>Back to Home</Button>
          </Link>
        }
      />
    </div>
  );
}
