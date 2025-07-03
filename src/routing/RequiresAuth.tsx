import { Outlet } from 'react-router-dom';
import { useUser } from '../authentication/index.ts';
import { LoadingPage } from '../pages/LoadingPage';

export function RequiresAuth() {
  const { isLoading, userData } = useUser();
  if (!isLoading && userData) {
    return <Outlet />;
  }
  return <LoadingPage />;
}
