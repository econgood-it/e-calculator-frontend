import { User } from '../authentication/User';
import NavigationBar from '../navigation/NavigationBar';
import { Grid } from '@mui/material';
import { useState } from 'react';
import BalanceSheetView from '../balanceSheet/BalanceSheetView';

type HomePageProps = {
  user: User;
};

const HomePage = ({ user }: HomePageProps) => {
  const [activeSheet, setActiveSheet] = useState<number | undefined>(undefined);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NavigationBar
          activeSheet={activeSheet}
          setActiveSheet={setActiveSheet}
          user={user}
        />
      </Grid>
      <Grid item xs={12}>
        {activeSheet === undefined ? <div>Content</div> : <BalanceSheetView />}
      </Grid>
    </Grid>
  );
};

export default HomePage;
