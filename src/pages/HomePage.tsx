import { User } from '../authentication/User';
import NavigationBar from '../navigation/NavigationBar';
import { Grid } from '@mui/material';
import { useState } from 'react';

type HomePageProps = {
  user: User;
};

const HomePage = ({ user }: HomePageProps) => {
  const [activeSheet, setActiveSheet] = useState<number | boolean>(false);

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
        {activeSheet === false ? (
          <div>Content</div>
        ) : (
          <div>{`Balance sheet ${activeSheet}`}</div>
        )}
      </Grid>
    </Grid>
  );
};

export default HomePage;
