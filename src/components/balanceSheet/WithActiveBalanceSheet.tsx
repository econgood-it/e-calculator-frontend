import ActiveBalanceSheetProvider from '../../contexts/ActiveBalanceSheetProvider';
import { Outlet } from 'react-router-dom';

const WithActiveBalanceSheet = () => {
  return (
    <ActiveBalanceSheetProvider>
      <Outlet />
    </ActiveBalanceSheetProvider>
  );
};

export default WithActiveBalanceSheet;
