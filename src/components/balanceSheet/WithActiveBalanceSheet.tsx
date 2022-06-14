import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BalanceSheetProvider } from '../../contexts/BalanceSheetContext';
import { BalanceSheetItem } from '../../dataTransferObjects/BalanceSheet';

const WithActiveBalanceSheet = () => {
  const { balanceSheetId } = useParams();
  const [activeBalanceSheet, setActiveBalanceSheet] = useState<
    BalanceSheetItem | undefined
  >();

  useEffect(() => {
    if (balanceSheetId) {
      setActiveBalanceSheet({ id: Number(balanceSheetId) });
    }
  }, [balanceSheetId]);
  return (
    <>
      {`Balance Sheet ${balanceSheetId}`}
      {activeBalanceSheet && (
        <BalanceSheetProvider activeBalanceSheet={activeBalanceSheet}>
          <Outlet />
        </BalanceSheetProvider>
      )}
    </>
  );
};

export default WithActiveBalanceSheet;
