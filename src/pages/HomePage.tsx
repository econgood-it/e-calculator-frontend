import { User } from '../authentication/User';
import NavigationBar from '../navigation/NavigationBar';
import { Grid } from '@mui/material';
import { useState } from 'react';
import BalanceSheetView from '../balanceSheet/BalanceSheetView';
import styled from 'styled-components';

const BodyGrid = styled(Grid)`
  position: relative;
  top: 52px;
`;

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
      <BodyGrid item xs={12}>
        {activeSheet === undefined ? (
          <div>Home</div>
        ) : (
          <BalanceSheetView user={user} balanceSheetId={activeSheet} />
        )}
      </BodyGrid>
    </Grid>
  );
};

export default HomePage;
