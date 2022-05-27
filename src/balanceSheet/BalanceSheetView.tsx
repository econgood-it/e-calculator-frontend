import { ReactElement, useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import BalanceSheetNavigation, {
  NavigationItems,
} from './BalanceSheetNavigation';
import RatingTable from './RatingTable';
import axios from 'axios';
import { API_URL } from '../configuration';
import { Rating, RatingSchema } from '../dataTransferObjects/Rating';
import styled from 'styled-components';
import { useLanguage } from '../i18n';
import { useUser } from '../authentication/UserContext';

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
};

const BalanceSheetView = ({ balanceSheetId }: BalanceSheetViewProps) => {
  const language = useLanguage();
  const { user } = useUser();
  const [selected, setSelected] = useState<NavigationItems>(
    NavigationItems.COMPANY_FACTS
  );
  const [ratings, setRatings] = useState<Rating[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${API_URL}/v1/balancesheets/${balanceSheetId}/`,
        {
          params: {
            lng: language,
            responseFormat: 'short',
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const balanceSheet = await response.data;
      setRatings(RatingSchema.array().parse(balanceSheet.ratings));
    };
    fetchData();
  }, [balanceSheetId, language]);

  const updateRatings = (newRatings: Rating[]): void => {
    setRatings((prevRatings: Rating[]) =>
      prevRatings.map(
        (r) =>
          newRatings.find((newRating) => newRating.shortName === r.shortName) ||
          r
      )
    );
  };
  const getRatingTableOfStakeholder = (stakeholder: string): ReactElement => {
    return (
      <RatingTable
        ratings={ratings.filter(
          (t) => t.shortName.length > 2 && t.shortName.startsWith(stakeholder)
        )}
        onRatingsUpdate={updateRatings}
        balanceSheetId={balanceSheetId}
      />
    );
  };

  const getContent = (): ReactElement => {
    switch (selected) {
      case NavigationItems.COMPANY_FACTS:
        return <>Company Facts</>;
      case NavigationItems.RATINGS:
        return <>Rating description</>;
      case NavigationItems.SUPPLIERS:
        return getRatingTableOfStakeholder('A');
      case NavigationItems.OWNERS:
        return getRatingTableOfStakeholder('B');
      case NavigationItems.EMPLOYEES:
        return getRatingTableOfStakeholder('C');
      case NavigationItems.CUSTOMERS:
        return getRatingTableOfStakeholder('D');
      case NavigationItems.SOCIETY:
        return getRatingTableOfStakeholder('E');
      default:
        return <>Default</>;
    }
  };

  return (
    <>
      {ratings.length > 0 ? (
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <BalanceSheetNavigation
              selected={selected}
              setSelected={setSelected}
            />
          </Grid>
          <GridWithBottomMargin item xs={8}>
            {getContent()}
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
