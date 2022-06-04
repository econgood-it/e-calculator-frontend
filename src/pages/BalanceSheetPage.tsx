import { useParams } from 'react-router-dom';

const BalanceSheetPage = () => {
  const { balancesheetId } = useParams();
  return <>{`Balance Sheet ${balancesheetId}`}</>;
};

export default BalanceSheetPage;
