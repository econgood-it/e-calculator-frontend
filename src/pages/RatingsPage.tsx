import { useActiveBalanceSheet } from '../contexts/WithActiveBalanceSheet';
import RatingCard from '../components/balanceSheet/RatingCard';
import { Rating } from '../dataTransferObjects/Rating';

const RatingsPage = () => {
  const { balanceSheet, setBalanceSheet } = useActiveBalanceSheet();

  const onRatingChanged = (rating: Rating) => {
    setBalanceSheet((prevState) => {
      return {
        ...prevState,
        ratings: prevState.ratings.map((r) => {
          return r.shortName === rating.shortName ? rating : r;
        }),
      };
    });
  };

  return (
    <>
      <div>Rating Page</div>
      {balanceSheet?.ratings.map((rating) => (
        <RatingCard
          key={rating.shortName}
          rating={rating}
          onChange={onRatingChanged}
        />
      ))}
    </>
  );
};

export default RatingsPage;
