import { Rating, RatingSchema } from '../../dataTransferObjects/Rating';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NumberInput } from './companyFacts/NumberInputs';
import { Trans, useTranslation } from 'react-i18next';
import GridItem from '../layout/GridItem';
import GridContainer, { FormContainer } from '../layout/GridContainer';
import { Typography } from '@mui/material';
import { SaveButton } from './companyFacts/SaveButton';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';

type RatingsFormProps = {
  ratings: Rating[];
};

const RatingsFormSchema = z.object({ ratings: RatingSchema.array() });
type RatingsFormInput = z.infer<typeof RatingsFormSchema>;

export function RatingsForm({ ratings }: RatingsFormProps) {
  const { t } = useTranslation();
  const { updateRatings } = useActiveBalanceSheet();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RatingsFormInput>({
    resolver: zodResolver(RatingsFormSchema),
    mode: 'onChange',
    defaultValues: { ratings: ratings },
  });
  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'ratings', // unique name for your Field Array
  });

  const onSaveClick = async (data: RatingsFormInput) => {
    const newRatings = RatingsFormSchema.parse(data);
    await updateRatings(newRatings.ratings);
  };

  return (
    <FormContainer spacing={3}>
      {fields.map((r, index) => (
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
                fullWidth
                label={<Trans>Estimations</Trans>}
                error={!!errors.ratings?.[index]?.estimations}
                errorMessage={
                  !!errors.ratings?.[index]?.estimations &&
                  t(`${errors.ratings?.[index]?.estimations?.message}`)
                }
                register={register}
                registerKey={`ratings.${index}.estimations`}
                required={true}
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
