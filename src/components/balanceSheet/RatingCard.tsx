import { Rating } from '../../dataTransferObjects/Rating';
import { Card, CardContent, CardHeader } from '@mui/material';
import PositiveRating from './PositiveRating';

type RatingCardProps = {
  rating: Rating;
  onChange: (rating: Rating) => void;
};
export default function RatingCard({ rating, onChange }: RatingCardProps) {
  return (
    <Card aria-label="rating-card" sx={{ maxWidth: 345 }}>
      <CardHeader title={rating.shortName} />
      <CardContent>
        <PositiveRating
          value={rating.estimations}
          onChange={(newEstimations) =>
            onChange({ ...rating, estimations: newEstimations })
          }
        />
      </CardContent>
    </Card>
  );
}
