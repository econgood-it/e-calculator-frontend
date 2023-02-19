import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import {
  RatingType,
  StakholderShortNames,
} from '../dataTransferObjects/Rating';
import { RatingsForm } from '../components/balanceSheet/RatingsForm';

type RatingsPageProps = {
  stakeholderToFilterBy: StakholderShortNames;
};

const RatingsPage = ({ stakeholderToFilterBy }: RatingsPageProps) => {
  const { balanceSheet } = useActiveBalanceSheet();

  return (
    <>
      {balanceSheet && (
        <RatingsForm
          ratings={balanceSheet.ratings
            .filter((rating) =>
              rating.shortName.startsWith(stakeholderToFilterBy)
            )
            .filter((rating) => rating.type === RatingType.aspect)}
        />
      )}
    </>
  );
};

export default RatingsPage;
