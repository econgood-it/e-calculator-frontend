import GridItem from '../layout/GridItem';
import GridContainer, { FormContainer } from '../layout/GridContainer';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Rating as MuiRating,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';
import { Fragment, useState } from 'react';
import { Rating } from '../../models/Rating';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { WEIGHT_VALUES } from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import styled from 'styled-components';
import { ShortNameAvatar } from '../matrix/MatrixView';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';

type RatingsFormProps = {
  ratings: Rating[];
  stakeholderName: string;
};

export function RatingsForm({ ratings }: RatingsFormProps) {
  const { updateRatings } = useActiveBalanceSheet();

  return (
    <FormContainer spacing={3}>
      {ratings.map((rating) => (
        <Fragment key={rating.shortName}>
          {rating.type === RatingType.topic ? (
            <GridItem xs={12}>
              <Topic
                rating={rating}
                updateRating={async (rating) => {
                  await updateRatings([rating]);
                }}
              />
            </GridItem>
          ) : (
            <GridItem xs={12} lg={4}>
              <Aspect
                rating={rating}
                updateRating={async (rating) => {
                  await updateRatings([rating]);
                }}
              />
            </GridItem>
          )}
        </Fragment>
      ))}
    </FormContainer>
  );
}

const StyledDiv = styled.div`
  min-width: 120px;
`;

type TopicProps = {
  rating: Rating;
  updateRating: (ratings: Rating) => Promise<void>;
};

function Topic({ rating, updateRating }: TopicProps) {
  return (
    <Card>
      <CardContent>
        <GridContainer
          alignItems={'center'}
          justifyContent="space-between"
          spacing={2}
        >
          <GridItem>
            <GridContainer alignItems="center" spacing={1}>
              <GridItem>
                <ShortNameAvatar>{rating.shortName}</ShortNameAvatar>
              </GridItem>
              <GridItem>
                <Typography variant={'body1'}>{rating.name}</Typography>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem>
            <GridContainer
              alignItems="center"
              spacing={2}
              justifyContent={'center'}
            >
              <GridItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rating.isWeightSelectedByUser}
                      onChange={async (event) => {
                        await updateRating({
                          ...rating,
                          isWeightSelectedByUser: event.target.checked,
                        });
                      }}
                    />
                  }
                  label={<Trans>Select weight manually</Trans>}
                />
              </GridItem>
              <GridItem>
                <StyledDiv>
                  <FormControl fullWidth>
                    <InputLabel id={'weight-label'}>
                      <Trans>Weight</Trans>
                    </InputLabel>
                    <Select
                      disabled={!rating.isWeightSelectedByUser}
                      autoWidth
                      labelId={'weight-label'}
                      label={<Trans>Weight</Trans>}
                      value={rating.weight}
                      onChange={async (event) =>
                        await updateRating({
                          ...rating,
                          weight: event.target.value as number,
                        })
                      }
                    >
                      {WEIGHT_VALUES.map((weight, index) => (
                        <MenuItem key={index} value={weight}>
                          {weight}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </StyledDiv>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </CardContent>
    </Card>
  );
}

type AspectProps = {
  rating: Rating;
  updateRating: (ratings: Rating) => Promise<void>;
};

function Aspect({ rating, updateRating }: AspectProps) {
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="body1">{`${rating.shortName} ${rating.name}`}</Typography>
        }
      />
      <CardContent>
        {rating.isPositive && (
          <PositiveRatingTemp
            ariaLabel={`Estimations of the ratings ${rating.shortName}`}
            value={rating.estimations}
            onChange={async (value) => {
              await updateRating({
                ...rating,
                estimations: value,
              });
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

const StyledRating = styled(MuiRating)`
  & .MuiRating-iconFilled {
    color: ${(props) => props.theme.palette.primary.main};
  }
  & .MuiRating-iconHover {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

function PositiveRatingTemp({
  value,
  ariaLabel,
}: {
  ariaLabel: string;
  value: number;
  onChange: (value: number) => Promise<void>;
}) {
  const [hover, setHover] = useState<number>(-1);
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState(value);

  const getLabel = (currentValue?: number): string => {
    if (currentValue == null) {
      return 'Basislinie';
    } else if (currentValue === 1) {
      return 'Erste Schritte';
    } else if (currentValue >= 2 && currentValue <= 3) {
      return 'Fortgeschritten';
    } else if (currentValue >= 4 && currentValue <= 6) {
      return 'Erfahren';
    } else if (currentValue >= 7 && currentValue <= 10) {
      return 'Vorbildlich';
    } else {
      return 'Basislinie';
    }
  };

  return (
    <GridContainer alignItems="center" spacing={3} justifyContent={'center'}>
      <GridItem>
        <StyledRating
          aria-label={ariaLabel}
          value={localValue}
          onChange={async (_, newValue) => {
            if (newValue !== null) {
              setLocalValue(newValue);
            }
          }}
          max={10}
          icon={<FontAwesomeIcon icon={faSeedling} />}
          emptyIcon={<FontAwesomeIcon icon={faSeedling} />}
          onChangeActive={(_, newHover) => {
            setHover(newHover);
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <Divider>
          <Chip label={getLabel(hover !== -1 ? hover : localValue)} />
        </Divider>
      </GridItem>
      <GridItem>
        {localValue !== null && (
          <Typography variant={'h2'}>
            {`${hover !== -1 ? hover : localValue} ${t`Points`}`}
          </Typography>
        )}
      </GridItem>
    </GridContainer>
  );
}
