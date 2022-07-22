import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import RatingCard from '../components/balanceSheet/RatingCard';
import { RatingType } from '../dataTransferObjects/Rating';

const RatingsPage = () => {
  const { balanceSheet, updateRating } = useActiveBalanceSheet();

  return (
    <>
      <div>Rating Page</div>
      {balanceSheet?.ratings
        .filter((rating) => rating.type === RatingType.aspect)
        .map((rating) => (
          <RatingCard
            key={rating.shortName}
            rating={rating}
            onChange={(rating) => updateRating(rating)}
          />
        ))}
    </>
  );
};

export default RatingsPage;
