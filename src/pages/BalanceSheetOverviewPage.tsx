import { useParams } from 'react-router-dom';

export function BalanceSheetOverviewPage() {
  const { balanceSheetId } = useParams();

  return <div>{`Balance sheet ${balanceSheetId}`}</div>;
}
