import { useState } from 'react';
import { Grid } from '@mui/material';
import BalanceSheetNavigation, {
  NavigationItems,
} from './BalanceSheetNavigation';

const BalanceSheetView = () => {
  const [selectedIndex, setSelectedIndex] = useState<NavigationItems>(
    NavigationItems.COMPANY_FACTS
  );

  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <BalanceSheetNavigation
          selected={selectedIndex}
          setSelected={setSelectedIndex}
        />
      </Grid>
      <Grid item xs={9}>
        Content
      </Grid>
    </Grid>
  );
};

export default BalanceSheetView;
