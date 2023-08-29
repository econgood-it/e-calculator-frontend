import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';

const BalanceSheetListPage = () => {
  const [balanceSheetItems] = useBalanceSheetItems();
  return (
    <>
      {balanceSheetItems.map((b) => (
        <div key={b.id}>
          <Link to={`balancesheet/${b.id}`}>
            <Trans>Balance sheet</Trans> {b.id}
          </Link>
        </div>
      ))}
    </>
  );
};

export default BalanceSheetListPage;
