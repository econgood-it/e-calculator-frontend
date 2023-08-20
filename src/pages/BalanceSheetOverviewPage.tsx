import { useParams } from 'react-router-dom';
import { ContainerWithTopMargin } from '../components/layout/GridContainer';

const BalanceSheetOverviewPage = () => {
  const { balanceSheetId } = useParams();

  return (
    <ContainerWithTopMargin>
      <div>{`Balance sheet ${balanceSheetId}`}</div>
    </ContainerWithTopMargin>
  );
};

export default BalanceSheetOverviewPage;
