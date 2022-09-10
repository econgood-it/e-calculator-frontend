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
import NegativeRating from './NegativeRating';

type RatingCardProps = {
  rating: Rating;
  onRatingSaved: (rating: Rating) => void;
};
export default function RatingCard({ rating, onRatingSaved }: RatingCardProps) {
  const theme = useTheme();
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const [validToSave, setValidToSave] = useState<boolean>(true);
  const [estimations, setEstimations] = useState<number>(rating.estimations);

  const onSaveClicked = () => {
    onRatingSaved({ ...rating, estimations: estimations });
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
        {rating.isPositive ? (
          <PositiveRating
            readOnly={!inEditMode}
            value={estimations}
            onChange={(newValue) => {
              setEstimations(newValue);
            }}
          />
        ) : (
          <NegativeRating
            readOnly={!inEditMode}
            estimations={estimations}
            onError={() => setValidToSave(false)}
            onEstimationsChange={(newValue) => {
              setEstimations(newValue);
              setValidToSave(true);
            }}
          />
        )}
      </CardContent>
      <CardActions>
        {inEditMode ? (
          <CallToActionButton
            disabled={!validToSave}
            onClick={onSaveClicked}
            aria-label="save rating"
          >
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
