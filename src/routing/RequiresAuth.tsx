import { User } from '../authentication/User';
import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ApiProvider } from '../contexts/ApiContext';
import { BalanceSheetListProvider } from '../contexts/BalanceSheetListContext';

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
      <BalanceSheetListProvider>
        <Outlet />
      </BalanceSheetListProvider>
    </ApiProvider>
  );
};

export default RequiresAuth;
