import {
  ArrayPath,
  Control,
  FieldArrayWithId,
  FieldValues,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import GridItem from '../layout/GridItem';
import GridContainer, { FormContainer } from '../layout/GridContainer';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { SaveButton } from './forms/SaveButton';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';
import { useEffect, useRef } from 'react';
import { Rating } from '../../models/Rating';
import {
  RatingResponseBodySchema,
  RatingType,
} from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useWorkbook } from '../../contexts/WorkbookProvider';
import PositiveRating from './PositiveRating';
import { NegativeRating } from './NegativeRating';
import { IWorkbook } from '../../models/Workbook';
import { ReactHookFormSwitch } from '../lib/ReactHookFormSwitch';

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
      {ratingsFields.map((r, index) => {
        return r.type === RatingType.topic ? (
          <Topic key={r.id} rating={r} />
        ) : (
          <Aspect
            key={r.id}
            rating={r}
            name={fieldArrayName}
            index={index}
            control={control}
            workbook={workbook}
          />
        );
      })}
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}

type TopicProps = {
  rating: FieldArrayWithId<RatingsFormInput>;
};

function Topic({ rating }: TopicProps) {
  return (
    <GridItem key={rating.shortName} xs={12}>
      <Typography variant={'h1'}>{rating.name}</Typography>
    </GridItem>
  );
}

type AspectProps = {
  rating: FieldArrayWithId<RatingsFormInput>;
  name: ArrayPath<RatingsFormInput>;
  index: number;
  control: Control<RatingsFormInput>;
  workbook?: IWorkbook;
};

function Aspect({ rating, name, index, control, workbook }: AspectProps) {
  return (
    <GridItem key={rating.shortName} xs={12}>
      <GridContainer alignItems={'center'} spacing={2}>
        <GridItem xs={12} sm={1}>
          <Typography variant={'body1'}>{rating.shortName}</Typography>
        </GridItem>
        <GridItem xs={12} sm={7}>
          <Typography variant={'body1'}>{rating.name}</Typography>
        </GridItem>
        {rating.isPositive ? (
          <>
            <GridItem xs={12} sm={3}>
              <PositiveRating
                control={control}
                name={`${name}.${index}.estimations`}
              />
            </GridItem>
            <GridItem xs={12} sm={1}>
              <ReactHookFormSwitch
                control={control}
                name={`${name}.${index}.isWeightSelectedByUser`}
                label={'Weight'}
              />
            </GridItem>
          </>
        ) : (
          <GridItem xs={12} sm={3}>
            <NegativeRating
              control={control}
              name={`${name}.${index}.estimations`}
            />
          </GridItem>
        )}
        <GridItem xs={12} sm={1}>
          {workbook && workbook.hasSection(rating.shortName) && (
            <Tooltip
              title={`Title: ${workbook.getSection(rating.shortName)?.title}`}
            >
              <IconButton aria-label={'info'} color={'secondary'}>
                <FontAwesomeIcon icon={faCircleInfo} />
              </IconButton>
            </Tooltip>
          )}
        </GridItem>
      </GridContainer>
    </GridItem>
  );
}
