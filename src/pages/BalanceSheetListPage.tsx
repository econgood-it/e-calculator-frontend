import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListContext';
import { ContainerWithTopMargin } from '../components/layout/GridContainer';

const BalanceSheetListPage = () => {
  const [balanceSheetItems] = useBalanceSheetItems();
  return (
    <ContainerWithTopMargin>
      {balanceSheetItems.map((b) => (
        <div key={b.id}>
          <Link to={`${b.id}`}>
            <Trans>Balance sheet</Trans> {b.id}
          </Link>
        </div>
      ))}
    </ContainerWithTopMargin>
  );
};

export default BalanceSheetListPage;
