import {
  ArrayPath,
  Control,
  FieldValues,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import GridItem from '../layout/GridItem';
import GridContainer, { FormContainer } from '../layout/GridContainer';
import {
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Typography,
} from '@mui/material';
import { SaveButton } from '../buttons/SaveButton.tsx';
import { useActiveBalanceSheet } from '../../contexts/ActiveBalanceSheetProvider';
import { Fragment } from 'react';
import { Rating } from '../../models/Rating';
import {
  RatingResponseBodySchema,
  RatingType,
} from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { useWorkbook } from '../../contexts/WorkbookProvider';
import PositiveRating from './PositiveRating';
import { NegativeRating } from './NegativeRating';
import { IWorkbook } from '../../models/Workbook';
import { ReactHookFormSwitch } from '../lib/ReactHookFormSwitch';
import { WEIGHT_VALUES } from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import { ReactHookFormSelect } from '../lib/ReactHookFormSelect';
import styled from 'styled-components';
import { ShortNameAvatar } from '../matrix/MatrixView';
import { Trans } from 'react-i18next';

type RatingsFormProps = {
  ratings: Rating[];
};

const RatingsFormSchema = z.object({
  ratings: RatingResponseBodySchema.array(),
});
type RatingsFormInput = z.infer<typeof RatingsFormSchema>;

export function RatingsForm({ ratings }: RatingsFormProps) {
  const { updateRatings } = useActiveBalanceSheet();
  const workbook = useWorkbook();

  const { control, handleSubmit } = useForm<RatingsFormInput>({
    resolver: zodResolver(RatingsFormSchema),
    mode: 'onChange',
    defaultValues: { ratings: ratings },
    values: { ratings: ratings },
  });

  const fieldArrayName = 'ratings';
  const { fields: ratingsFields } = useFieldArray<RatingsFormInput>({
    control: control, // control props comes from useForm (optional: if you are using FormContext)
    name: fieldArrayName, // unique name for your Field Array
  });

  const onSaveClick = async (data: FieldValues) => {
    const newRatings = RatingsFormSchema.parse(data);
    await updateRatings(newRatings.ratings);
  };

  const ratingsWatcher = useWatch({
    control,
    name: fieldArrayName,
  });

  return (
    <FormContainer spacing={3}>
      {ratingsFields.map(({ type, shortName, name, isPositive }, index) => (
        <Fragment key={shortName}>
          {type === RatingType.topic ? (
            <GridItem xs={12}>
              <Topic
                fieldArrayName={fieldArrayName}
                shortName={shortName}
                name={name}
                index={index}
                isWeightSelectedByUser={
                  ratingsWatcher[index].isWeightSelectedByUser
                }
                control={control}
              />
            </GridItem>
          ) : (
            <GridItem md={12} lg={4}>
              <Aspect
                shortName={shortName}
                name={name}
                isPositive={isPositive}
                fieldArrayName={fieldArrayName}
                index={index}
                control={control}
                workbook={workbook}
              />
            </GridItem>
          )}
        </Fragment>
      ))}
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}

const StyledDiv = styled.div`
  min-width: 120px;
`;

type TopicProps = {
  shortName: string;
  name: string;
  fieldArrayName: ArrayPath<RatingsFormInput>;
  index: number;
  isWeightSelectedByUser: boolean;
  control: Control<RatingsFormInput>;
};

function Topic({
  shortName,
  name,
  fieldArrayName,
  index,
  isWeightSelectedByUser,
  control,
}: TopicProps) {
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
                <ShortNameAvatar>{shortName}</ShortNameAvatar>
              </GridItem>
              <GridItem>
                <Typography variant={'body1'}>{name}</Typography>
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
                <ReactHookFormSwitch
                  control={control}
                  name={`${fieldArrayName}.${index}.isWeightSelectedByUser`}
                  label={<Trans>Select weight manually</Trans>}
                />
              </GridItem>
              <GridItem>
                {isWeightSelectedByUser && (
                  <StyledDiv>
                    <ReactHookFormSelect
                      control={control}
                      name={`${fieldArrayName}.${index}.weight`}
                      label={<Trans>Weight</Trans>}
                      defaultValue={1}
                    >
                      {WEIGHT_VALUES.map((weight, index) => (
                        <MenuItem key={index} value={weight}>
                          {weight}
                        </MenuItem>
                      ))}
                    </ReactHookFormSelect>
                  </StyledDiv>
                )}
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </CardContent>
    </Card>
  );
}

type AspectProps = {
  shortName: string;
  name: string;
  isPositive: boolean;
  fieldArrayName: ArrayPath<RatingsFormInput>;
  index: number;
  control: Control<RatingsFormInput>;
  workbook?: IWorkbook;
};

function Aspect({
  shortName,
  name,
  isPositive,
  fieldArrayName,
  index,
  control,
}: AspectProps) {
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="body1">{`${shortName} ${name}`}</Typography>
        }
      />
      <CardContent>
        {isPositive ? (
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
      </CardContent>
    </Card>
  );
}
