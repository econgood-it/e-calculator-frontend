import { User } from '../authentication/User';
import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ApiProvider } from '../contexts/ApiContext';
import { BalanceSheetListProvider } from '../contexts/BalanceSheetListContext';
import { OrganizationProvider } from '../contexts/OrganizationContext';

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
      <OrganizationProvider user={user}>
        <BalanceSheetListProvider>
          <Outlet />
        </BalanceSheetListProvider>
      </OrganizationProvider>
    </ApiProvider>
  );
};

export default RequiresAuth;
