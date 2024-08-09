import { Outlet } from 'react-router-dom';
import { useAuth } from 'oidc-react';
import { LoadingPage } from '../pages/LoadingPage';

export function RequiresAuth() {
  const { isLoading, userData } = useAuth();
  if (!isLoading && userData) {
    return <Outlet />;
  }
  return <LoadingPage />;
}
