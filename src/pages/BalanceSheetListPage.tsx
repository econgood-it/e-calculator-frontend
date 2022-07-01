import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useBalanceSheetItems } from '../contexts/BalanceSheetContext';

const BalanceSheetListPage = () => {
  const { t } = useTranslation('balance-sheet-overview');
  const [balanceSheetItems] = useBalanceSheetItems();
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
