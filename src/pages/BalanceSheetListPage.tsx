import { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export type BalanceSheetItem = {
  id: number;
};
const BalanceSheetListPage = () => {
  const [balanceSheetItems, setBalanceSheetItems] = useState<
    BalanceSheetItem[]
  >([{ id: 1 }, { id: 2 }]);
  const { t } = useTranslation('balance-sheet-overview');
  const api = useApi();
  useEffect(() => {
    (async () => {
      const response = await api.get(`v1/balancesheets`);
      setBalanceSheetItems(response.data);
    })();
  }, [api, balanceSheetItems]);

  return (
    <>
      {balanceSheetItems.map((b) => (
        <div key={b.id}>
          <Link to={`${b.id}`}>
            <Trans t={t}>Balance sheet</Trans> {b.id}
          </Link>
        </div>
      ))}
    </>
  );
};

export default BalanceSheetListPage;
