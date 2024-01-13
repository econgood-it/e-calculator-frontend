import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';

import { RatingsForm } from '../components/balanceSheet/RatingsForm';
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
          ratings={balanceSheet.ratings.filter((rating: Rating) =>
            rating.shortName.startsWith(stakeholderToFilterBy)
          )}
        />
      )}
    </>
  );
};

export default RatingsPage;
