import ActiveBalanceSheetProvider from '../../contexts/ActiveBalanceSheetProvider';
import { Outlet } from 'react-router-dom';
import WorkbookProvider from '../../contexts/WorkbookProvider';

const WithActiveBalanceSheet = () => {
  return (
    <WorkbookProvider>
      <ActiveBalanceSheetProvider>
        <Outlet />
      </ActiveBalanceSheetProvider>
    </WorkbookProvider>
  );
};

export default WithActiveBalanceSheet;
