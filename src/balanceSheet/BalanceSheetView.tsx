import { useState } from 'react';
import { Grid } from '@mui/material';
import BalanceSheetNavigation, {
  NavigationItems,
} from './BalanceSheetNavigation';
import RatingTable from './RatingTable';

const BalanceSheetView = () => {
  const [selected, setSelected] = useState<NavigationItems>(
    NavigationItems.COMPANY_FACTS
  );

  const getContent = () => {
    switch (selected) {
      case NavigationItems.COMPANY_FACTS:
        return <>Company Facts</>;
      case NavigationItems.RATINGS:
        return <RatingTable />;
      default:
        return <>Default</>;
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <BalanceSheetNavigation selected={selected} setSelected={setSelected} />
      </Grid>
      <Grid item xs={8}>
        {getContent()}
      </Grid>
    </Grid>
  );
};

export default BalanceSheetView;
