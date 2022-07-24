import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import RatingCard from '../components/balanceSheet/RatingCard';
import {
  RatingType,
  StakholderShortNames,
} from '../dataTransferObjects/Rating';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';

type RatingsPageProps = {
  stakeholderToFilterBy: StakholderShortNames;
};

const RatingsPage = ({ stakeholderToFilterBy }: RatingsPageProps) => {
  const { balanceSheet, updateRating } = useActiveBalanceSheet();

  return (
    <>
      <div>Rating Page</div>
      <GridContainer spacing={2}>
        {balanceSheet?.ratings
          .filter((rating) =>
            rating.shortName.startsWith(stakeholderToFilterBy)
          )
          .filter((rating) => rating.type === RatingType.aspect)
          .map((rating) => (
            <GridItem key={rating.shortName}>
              <RatingCard
                rating={rating}
                onChange={(rating) => updateRating(rating)}
              />
            </GridItem>
          ))}
      </GridContainer>
    </>
  );
};

export default RatingsPage;
