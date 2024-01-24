import { CircularProgress } from "@mui/material";
import { CenteredDiv } from "../components/layout/CenteredDiv";
import GridContainer from "../components/layout/GridContainer.tsx";
import GridItem from "../components/layout/GridItem.tsx";

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
