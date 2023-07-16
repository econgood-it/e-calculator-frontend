import { useParams } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useEffect } from 'react';

const BalanceSheetOverviewPage = () => {
  const { balanceSheetId } = useParams();
  const api = useApi();

  useEffect(() => {
    (async () => {
      const data = await api.getOrganizations();
      console.log(data);
    })();
  }, [api]);

  return (
    <>
      <div>{`Balance sheet ${balanceSheetId}`}</div>
    </>
  );
};

export default BalanceSheetOverviewPage;
