import { User } from '../authentication/User';
import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserProvider } from '../authentication/UserContext';

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
    <UserProvider user={user}>
      <Outlet />
    </UserProvider>
  );
};

export default RequiresAuth;
