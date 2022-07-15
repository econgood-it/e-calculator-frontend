import { useActiveBalanceSheet } from '../contexts/WithActiveBalanceSheet';
import RatingCard from '../components/balanceSheet/RatingCard';

const RatingsPage = () => {
  const { balanceSheet, updateRating } = useActiveBalanceSheet();

  return (
    <>
      <div>Rating Page</div>
      {balanceSheet?.ratings.map((rating) => (
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
