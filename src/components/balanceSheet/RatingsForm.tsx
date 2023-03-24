import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NumberInput } from './forms/NumberInputs';
import { Trans } from 'react-i18next';
import GridItem from '../layout/GridItem';
import GridContainer, { FormContainer } from '../layout/GridContainer';
import { Typography } from '@mui/material';
import { SaveButton } from './forms/SaveButton';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';
import { useEffect } from 'react';
import { Rating } from '../../models/Rating';
import { RatingResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/rating.dto';

type RatingsFormProps = {
  ratings: Rating[];
};

const RatingsFormSchema = z.object({
  ratings: RatingResponseBodySchema.array(),
});
type RatingsFormInput = z.infer<typeof RatingsFormSchema>;

export function RatingsForm({ ratings }: RatingsFormProps) {
  const { updateRatings } = useActiveBalanceSheet();

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm<RatingsFormInput>({
    resolver: zodResolver(RatingsFormSchema),
    mode: 'onChange',
    defaultValues: { ratings: ratings },
  });
  useEffect(() => reset({ ratings: ratings }), [reset, ratings]);

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
          <GridContainer alignItems={'center'}>
            <GridItem xs={12} sm={1}>
              <Typography variant={'body1'}>{r.shortName}</Typography>
            </GridItem>
            <GridItem xs={12} sm={7}>
              <Typography variant={'body1'}>{r.name}</Typography>
            </GridItem>
            <GridItem xs={12} sm={4}>
              <NumberInput<RatingsFormInput>
                register={register}
                errors={errors}
                label={<Trans>Estimations</Trans>}
                registerKey={`${fieldArrayName}.${index}.estimations`}
              />
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
