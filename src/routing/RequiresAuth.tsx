import { Navigate, Outlet } from 'react-router-dom';
import { ApiProvider } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';

export function RequiresAuth() {
  const { user } = useUser();
  if (!user || !user.token || user.token === '') {
    return (
      <Navigate
        to={{
          pathname: '/login',
        }}
      />
    );
  }

  return (
    <ApiProvider>
      <Outlet />
    </ApiProvider>
  );
}
