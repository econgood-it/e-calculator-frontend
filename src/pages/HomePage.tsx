import { User } from '../authentication/User';
import NavigationBar from '../navigation/NavigationBar';
import { Grid } from '@mui/material';

type HomePageProps = {
  user: User;
};

const HomePage = ({ user }: HomePageProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NavigationBar user={user} />
      </Grid>
      <Grid item xs={12}>
        Content
      </Grid>
    </Grid>
  );
};

export default HomePage;
