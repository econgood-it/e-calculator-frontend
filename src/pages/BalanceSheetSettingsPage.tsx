import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { useBalanceSheetItems } from '../contexts/BalanceSheetListProvider';
import { Button } from '@mui/material';

export function BalanceSheetSettingsPage() {
  const { balanceSheet } = useActiveBalanceSheet();
  const { deleteBalanceSheet } = useBalanceSheetItems();
  return (
    <>
      <Button onClick={() => deleteBalanceSheet(balanceSheet!.id!)}>
        Delete this balance sheet
      </Button>
    </>
  );
}
