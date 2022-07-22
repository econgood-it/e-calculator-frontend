import { Rating } from '../../dataTransferObjects/Rating';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  useTheme,
} from '@mui/material';
import PositiveRating from './PositiveRating';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Trans } from 'react-i18next';
import { CallToActionButton } from '../buttons/CallToActionButton';

type RatingCardProps = {
  rating: Rating;
  onChange: (rating: Rating) => void;
};
export default function RatingCard({ rating, onChange }: RatingCardProps) {
  const theme = useTheme();
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const [estimations, setEstimations] = useState<number>(rating.estimations);

  const onSaveClicked = () => {
    onChange({ ...rating, estimations: estimations });
    setInEditMode(false);
  };

  return (
    <Card aria-label="rating-card" sx={{ maxWidth: 345 }}>
      <CardHeader
        title={
          <Typography
            variant="h2"
            component="h2"
            color={theme.palette.secondary.main}
          >
            {rating.shortName}
          </Typography>
        }
      />
      <CardContent>
        <PositiveRating
          readOnly={!inEditMode}
          value={estimations}
          onChange={(newValue) => {
            setEstimations(newValue);
          }}
        />
      </CardContent>
      <CardActions>
        {inEditMode ? (
          <CallToActionButton onClick={onSaveClicked} aria-label="save rating">
            <Trans>Save</Trans>
          </CallToActionButton>
        ) : (
          <CallToActionButton
            onClick={() => setInEditMode(true)}
            aria-label="edit rating"
          >
            <Trans>Edit</Trans>
          </CallToActionButton>
        )}
      </CardActions>
    </Card>
  );
}
