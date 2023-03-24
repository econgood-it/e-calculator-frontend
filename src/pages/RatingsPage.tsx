import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';

import { RatingsForm } from '../components/balanceSheet/RatingsForm';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { Rating, StakholderShortNames } from '../models/Rating';

type RatingsPageProps = {
  stakeholderToFilterBy: StakholderShortNames;
};

const RatingsPage = ({ stakeholderToFilterBy }: RatingsPageProps) => {
  const { balanceSheet } = useActiveBalanceSheet();

  return (
    <>
      {balanceSheet && (
        <RatingsForm
          stakeholderName={stakeholderToFilterBy}
          ratings={balanceSheet.ratings
            .filter((rating: Rating) =>
              rating.shortName.startsWith(stakeholderToFilterBy)
            )
            .filter((rating: Rating) => rating.type === RatingType.aspect)}
        />
      )}
    </>
  );
};

export default RatingsPage;
