import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';

// Guards instructor-only routes. Students who reach /admin are bounced home.
export function RequireAdmin({ children }: { children: ReactNode }) {
  const isAdmin = useAuth((s) => s.isAdmin);
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}
