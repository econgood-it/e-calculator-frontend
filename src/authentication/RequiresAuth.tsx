import { Navigate } from 'react-router-dom';
import { User } from './User';
import { FC, ReactElement } from 'react';

type ProtectedRouteProps = {
  user: User | undefined;
  children: ReactElement;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  user,
  children,
}: ProtectedRouteProps) => {
  if (!user || !user.token || user.token === '') {
    return (
      <Navigate
        to={{
          pathname: '/login',
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
