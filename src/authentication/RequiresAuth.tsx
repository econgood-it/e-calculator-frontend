import { User } from './User';
import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

type RequiresAuthProps = {
  user: User | undefined;
  children?: ReactElement;
};

const RequiresAuth: FC<RequiresAuthProps> = ({
  user,
  children,
}: RequiresAuthProps) => {
  if (!user || !user.token || user.token === '') {
    return (
      <Navigate
        to={{
          pathname: '/login',
        }}
      />
    );
  }

  return children || null;
};

export default RequiresAuth;
