import { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

export type BalanceSheetItem = {
  id: number;
};

const BalanceSheetOverviewPage = () => {
  const [balanceSheetItems, setBalanceSheetItems] = useState<
    BalanceSheetItem[]
  >([]);
  const { t } = useTranslation('balance-sheet-overview');
  const api = useApi();
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`v1/balancesheets`);
      const balanceSheets = await response.data;
      setBalanceSheetItems(balanceSheets);
    };
    fetchData();
  }, []);
  return (
    <>
      {balanceSheetItems.map((b) => (
        <div key={b.id}>
          <Link to={`balancesheets/${b.id}`}>
            <Trans t={t}>Balance sheet</Trans> {b.id}
          </Link>
        </div>
      ))}
    </>
  );
};

export default BalanceSheetOverviewPage;
