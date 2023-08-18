import { useParams } from 'react-router-dom';

const BalanceSheetOverviewPage = () => {
  const { balanceSheetId } = useParams();

  return (
    <>
      <div>{`Balance sheet ${balanceSheetId}`}</div>
    </>
  );
};

export default BalanceSheetOverviewPage;
