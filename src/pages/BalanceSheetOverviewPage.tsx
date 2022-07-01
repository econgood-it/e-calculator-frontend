import { useParams } from 'react-router-dom';

const BalanceSheetOverviewPage = () => {
  const { balanceSheetId } = useParams();

  return <>{`Balance sheet ${balanceSheetId}`}</>;
};

export default BalanceSheetOverviewPage;
