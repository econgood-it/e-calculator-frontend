import { Grid, GridProps } from '@mui/material';
import styled from 'styled-components';

const GridContainer = ({ children, ...props }: GridProps) => {
  return (
    <Grid {...props} container>
      {children}
    </Grid>
  );
};

export default GridContainer;

export const FormContainer = styled(GridContainer)``;
