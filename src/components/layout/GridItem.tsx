import { Grid, GridProps } from '@mui/material';

const GridItem = ({ children, ...props }: GridProps) => {
  return (
    <Grid {...props} item>
      {children}
    </Grid>
  );
};

export default GridItem;
