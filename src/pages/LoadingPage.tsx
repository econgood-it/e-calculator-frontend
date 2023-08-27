import { CircularProgress } from '@mui/material';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { CenteredDiv } from '../components/layout/CenteredDiv';

export function LoadingPage() {
  return (
    <CenteredDiv>
      <GridContainer justifyContent="center" alignItems="center">
        <GridItem>
          <CircularProgress aria-label="loading" />
        </GridItem>
      </GridContainer>
    </CenteredDiv>
  );
}
