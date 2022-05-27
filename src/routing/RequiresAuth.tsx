import { User } from '../authentication/User';
import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ApiProvider } from '../api/ApiContext';

type RequiresAuthProps = {
  user: User | undefined;
};

const RequiresAuth: FC<RequiresAuthProps> = ({ user }: RequiresAuthProps) => {
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
    <ApiProvider user={user}>
      <Outlet />
    </ApiProvider>
  );
};

export default RequiresAuth;
