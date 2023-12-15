import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import GridItem from '../layout/GridItem';
import GridContainer, { FormContainer } from '../layout/GridContainer';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { SaveButton } from './forms/SaveButton';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';
import { useEffect, useRef } from 'react';
import { Rating } from '../../models/Rating';
import { RatingResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useWorkbook } from '../../contexts/WorkbookProvider';
import PositiveRating from './PositiveRating';
import { NegativeRating } from './NegativeRating';

type RatingsFormProps = {
  ratings: Rating[];
  stakeholderName: string;
};

const RatingsFormSchema = z.object({
  ratings: RatingResponseBodySchema.array(),
});
type RatingsFormInput = z.infer<typeof RatingsFormSchema>;

export function RatingsForm({ ratings, stakeholderName }: RatingsFormProps) {
  const { updateRatings } = useActiveBalanceSheet();
  const workbook = useWorkbook();

  const stakeholderRef = useRef(stakeholderName);
  const { control, handleSubmit, reset } = useForm<RatingsFormInput>({
    resolver: zodResolver(RatingsFormSchema),
    mode: 'onChange',
    defaultValues: { ratings: ratings },
  });

  useEffect(() => {
    if (stakeholderRef.current !== stakeholderName) {
      reset({ ratings: ratings });
      stakeholderRef.current = stakeholderName;
    }
  }, [reset, ratings, stakeholderRef, stakeholderName]);

  const fieldArrayName = 'ratings';
  const { fields: ratingsFields } = useFieldArray<RatingsFormInput>({
    control: control, // control props comes from useForm (optional: if you are using FormContext)
    name: fieldArrayName, // unique name for your Field Array
  });

  const onSaveClick = async (data: FieldValues) => {
    const newRatings = RatingsFormSchema.parse(data);
    await updateRatings(newRatings.ratings);
  };

  return (
    <FormContainer spacing={3}>
      {ratingsFields.map((r, index) => (
        <GridItem key={r.shortName} xs={12}>
          <GridContainer alignItems={'center'} spacing={2}>
            <GridItem xs={12} sm={1}>
              <Typography variant={'body1'}>{r.shortName}</Typography>
            </GridItem>
            <GridItem xs={12} sm={7}>
              <Typography variant={'body1'}>{r.name}</Typography>
            </GridItem>
            {r.isPositive ? (
              <GridItem xs={12} sm={3}>
                <PositiveRating
                  control={control}
                  name={`${fieldArrayName}.${index}.estimations`}
                />
              </GridItem>
            ) : (
              <GridItem xs={12} sm={3}>
                <NegativeRating
                  control={control}
                  name={`${fieldArrayName}.${index}.estimations`}
                />
              </GridItem>
            )}

            <GridItem xs={12} sm={1}>
              {workbook && workbook.hasSection(r.shortName) && (
                <Tooltip
                  title={`Title: ${workbook.getSection(r.shortName)?.title}`}
                >
                  <IconButton aria-label={'info'} color={'secondary'}>
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </IconButton>
                </Tooltip>
              )}
            </GridItem>
          </GridContainer>
        </GridItem>
      ))}
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}
