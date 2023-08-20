import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListContext';

const BalanceSheetListPage = () => {
  const [balanceSheetItems] = useBalanceSheetItems();
  console.log(balanceSheetItems);
  return (
    <>
      {balanceSheetItems.map((b) => (
        <div key={b.id}>
          <Link to={`${b.id}`}>
            <Trans>Balance sheet</Trans> {b.id}
          </Link>
        </div>
      ))}
    </>
  );
};

export default BalanceSheetListPage;
