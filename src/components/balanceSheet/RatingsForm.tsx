import { ArrayPath, Control, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import GridItem from '../layout/GridItem';
import GridContainer from '../layout/GridContainer';
import { Card, CardContent, Typography } from '@mui/material';
import { Fragment } from 'react';
import {
  RatingResponseBodySchema,
  RatingType,
} from '@ecogood/e-calculator-schemas/dist/rating.dto';
import PositiveRating from './PositiveRating.tsx';
import { NegativeRating } from './NegativeRating';
import { ShortNameAvatar } from '../matrix/MatrixView';
import { Trans } from 'react-i18next';

export const RatingsFormSchema = z.object({
  ratings: RatingResponseBodySchema.array(),
});
export type RatingsFormInput = z.infer<typeof RatingsFormSchema>;

type RatingsFormProps = {
  control: Control<RatingsFormInput>;
};

export function RatingsForm({ control }: RatingsFormProps) {
  const fieldArrayName = 'ratings';
  const { fields: ratingsFields } = useFieldArray<RatingsFormInput>({
    control: control, // control props comes from useForm (optional: if you are using FormContext)
    name: fieldArrayName, // unique name for your Field Array
  });

  return (
    <GridContainer spacing={3}>
      {ratingsFields.map(
        ({ type, shortName, name, isPositive, weight }, index) => (
          <Fragment key={shortName}>
            {type === RatingType.topic ? (
              <GridItem xs={12}>
                <Topic shortName={shortName} name={name} weight={weight} />
              </GridItem>
            ) : (
              <GridItem md={12}>
                <Aspect
                  shortName={shortName}
                  name={name}
                  weight={weight}
                  isPositive={isPositive}
                  fieldArrayName={fieldArrayName}
                  index={index}
                  control={control}
                />
              </GridItem>
            )}
          </Fragment>
        )
      )}
    </GridContainer>
  );
}

type TopicProps = {
  shortName: string;
  name: string;
  weight: number;
};

function Topic({ shortName, name, weight }: TopicProps) {
  return (
    <Card>
      <CardContent>
        <GridContainer
          alignItems={'center'}
          justifyContent="space-between"
          spacing={2}
        >
          <GridItem>
            <GridContainer alignItems="center" spacing={2}>
              <GridItem>
                <ShortNameAvatar>{shortName}</ShortNameAvatar>
              </GridItem>
              <GridItem>
                <Typography variant={'body1'}>{name}</Typography>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem>
            {weight === 0 && (
              <Typography variant="h2" color="secondary">
                <Trans>Not considered</Trans>
              </Typography>
            )}
          </GridItem>
        </GridContainer>
      </CardContent>
    </Card>
  );
}

type AspectProps = {
  shortName: string;
  name: string;
  weight: number;
  isPositive: boolean;
  fieldArrayName: ArrayPath<RatingsFormInput>;
  index: number;
  control: Control<RatingsFormInput>;
};

function Aspect({
  shortName,
  name,
  weight,
  isPositive,
  fieldArrayName,
  index,
  control,
}: AspectProps) {
  return (
    <Card>
      <CardContent>
        <GridContainer
          alignItems={'center'}
          justifyContent="space-between"
          spacing={2}
        >
          <GridItem>
            <Typography variant="body1">{`${shortName} ${name}`}</Typography>
          </GridItem>

          <GridItem>
            {weight === 0 ? (
              <Typography variant="h2" color="secondary">
                <Trans>Not considered</Trans>
              </Typography>
            ) : isPositive ? (
              <PositiveRating
                control={control}
                name={`${fieldArrayName}.${index}.estimations`}
              />
            ) : (
              <NegativeRating
                control={control}
                name={`${fieldArrayName}.${index}.estimations`}
              />
            )}
          </GridItem>
        </GridContainer>
      </CardContent>
    </Card>
  );
}
