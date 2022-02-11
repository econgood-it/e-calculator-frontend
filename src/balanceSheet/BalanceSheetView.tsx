import { ReactElement, useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import BalanceSheetNavigation, {
  NavigationItems,
} from './BalanceSheetNavigation';
import RatingTable from './RatingTable';
import axios from 'axios';
import { API_URL } from '../configuration';
import { Rating, RatingSchema } from '../dataTransferObjects/Rating';
import { User } from '../authentication/User';
import styled from 'styled-components';
import { useLanguage } from '../i18n';

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80vh;
`;

const GridWithBottomMargin = styled(Grid)`
  margin-bottom: 40px;
`;
type BalanceSheetViewProps = {
  balanceSheetId: number;
  user: User;
};

const BalanceSheetView = ({ balanceSheetId, user }: BalanceSheetViewProps) => {
  const language = useLanguage();
  const [selected, setSelected] = useState<NavigationItems>(
    NavigationItems.COMPANY_FACTS
  );
  const [rating, setRating] = useState<Rating | undefined>();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${API_URL}/v1/balancesheets/${balanceSheetId}/`,
        {
          params: {
            lng: language,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const balanceSheet = await response.data;
      setRating(RatingSchema.parse(balanceSheet.rating));
    };
    fetchData();
  }, [balanceSheetId, language]);

  const getRatingTableOfStakeholder = (
    currentRating: Rating,
    stakeholder: string
  ): ReactElement => {
    return (
      <RatingTable
        topics={currentRating.topics.filter((t) =>
          t.shortName.startsWith(stakeholder)
        )}
      />
    );
  };

  const getContent = (currentRating: Rating): ReactElement => {
    switch (selected) {
      case NavigationItems.COMPANY_FACTS:
        return <>Company Facts</>;
      case NavigationItems.RATINGS:
        return <>Rating description</>;
      case NavigationItems.SUPPLIERS:
        return getRatingTableOfStakeholder(currentRating, 'A');
      case NavigationItems.OWNERS:
        return getRatingTableOfStakeholder(currentRating, 'B');
      case NavigationItems.EMPLOYEES:
        return getRatingTableOfStakeholder(currentRating, 'C');
      case NavigationItems.CUSTOMERS:
        return getRatingTableOfStakeholder(currentRating, 'D');
      case NavigationItems.SOCIETY:
        return getRatingTableOfStakeholder(currentRating, 'E');
      default:
        return <>Default</>;
    }
  };

  return (
    <>
      {rating ? (
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <BalanceSheetNavigation
              selected={selected}
              setSelected={setSelected}
            />
          </Grid>
          <GridWithBottomMargin item xs={8}>
            {getContent(rating)}
          </GridWithBottomMargin>
        </Grid>
      ) : (
        <CenteredDiv>
          <CircularProgress size={80} color="secondary" />
        </CenteredDiv>
      )}
    </>
  );
};

export default BalanceSheetView;
