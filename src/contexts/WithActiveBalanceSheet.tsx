import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { BalanceSheet } from '../dataTransferObjects/BalanceSheet';
import { useApi } from './ApiContext';

type ContextType = {
  balanceSheet?: BalanceSheet;
  setBalanceSheet: Dispatch<SetStateAction<BalanceSheet>>;
};

export default function WithActiveBalanceSheet() {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | undefined>(
    undefined
  );

  const api = useApi();
  const { balanceSheetId } = useParams();
  useEffect(() => {
    (async () => {
      const response = await api.get(`v1/balancesheets/${balanceSheetId}`);
      setBalanceSheet(response.data);
    })();
  }, [balanceSheetId]);

  return (
    <div>
      <Outlet context={{ balanceSheet, setBalanceSheet }} />
    </div>
  );
}

export function useActiveBalanceSheet() {
  return useOutletContext<ContextType>();
}
