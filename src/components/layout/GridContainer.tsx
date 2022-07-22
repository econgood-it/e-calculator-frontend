import { Grid, GridProps } from '@mui/material';

const GridContainer = ({ children, ...props }: GridProps) => {
  return (
    <Grid {...props} container>
      {children}
    </Grid>
  );
};

export default GridContainer;
