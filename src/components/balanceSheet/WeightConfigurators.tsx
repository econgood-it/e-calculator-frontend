import { Rating } from '../../models/Rating.ts';
import GridContainer from '../layout/GridContainer.tsx';
import GridItem from '../layout/GridItem.tsx';
import { Button, Checkbox, MenuItem, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from 'react-i18next';
import { ChangeEvent, Fragment, useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import { RatingResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { FieldValues, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactHookFormSwitch } from '../lib/ReactHookFormSwitch.tsx';
import { ReactHookFormSelect } from '../lib/ReactHookFormSelect.tsx';
import {
  BalanceSheetVersion,
  WEIGHT_VALUES,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import styled from 'styled-components';
import { SaveButton } from '../buttons/SaveButton.tsx';
import Drawer from '@mui/material/Drawer';
import { faSliders } from '@fortawesome/free-solid-svg-icons/faSliders';
import {
  faCircle,
  faCircleCheck,
  faSquare,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { eq } from 'lodash';

export type RatingsConfiguratorProps = {
  ratings: Rating[];
  onRatingsChange: (ratings: Rating[]) => Promise<void>;
  version: BalanceSheetVersion;
};

const RatingsFormSchema = z.object({
  ratings: RatingResponseBodySchema.array(),
});
type RatingsFormInput = z.infer<typeof RatingsFormSchema>;

const StyledDiv = styled.div`
  min-width: 120px;
`;

export function WeightConfigurator({
  ratings,
  onRatingsChange,
  version,
}: RatingsConfiguratorProps) {
  const [expanded, setExpanded] = useState(false);

  const { control, handleSubmit, setValue } = useForm<RatingsFormInput>({
    resolver: zodResolver(RatingsFormSchema),
    mode: 'onChange',
    defaultValues: { ratings: ratings },
    values: { ratings: ratings },
  });

  const fieldArrayName = 'ratings';

  const watchedRatings = useWatch({
    control,
    name: fieldArrayName,
  });

  const exclusiveOptions = useMemo(() => ['B1.1', 'B1.2'], []);

  const shouldEnableExclusiveOptions = useCallback(
    (shortName: string) => {
      return (
        eq(version, BalanceSheetVersion.v5_1_0) &&
        exclusiveOptions.includes(shortName)
      );
    },
    [version, exclusiveOptions]
  );

  const resetUnselectedOptions = useCallback(
    (selectedOption: string) => {
      exclusiveOptions
        .filter((option) => option !== selectedOption)
        .forEach((option) => {
          const index = ratings.findIndex((r) => r.shortName === option);
          setValue(`${fieldArrayName}.${index}.weight`, 0);
          setValue(`${fieldArrayName}.${index}.isWeightSelectedByUser`, true);
        });
    },
    [exclusiveOptions, ratings, setValue]
  );

  const onSaveClick = async (data: FieldValues) => {
    const newRatings = RatingsFormSchema.parse(data);
    await onRatingsChange(newRatings.ratings);
    setExpanded(false);
  };

  const onCheckboxChanged = (
    event: ChangeEvent<HTMLInputElement>,
    shortName: string,
    index: number
  ) => {
    if (!event.target.checked) {
      setValue(`${fieldArrayName}.${index}.weight`, 0);
      setValue(`${fieldArrayName}.${index}.isWeightSelectedByUser`, true);
    } else {
      if (shouldEnableExclusiveOptions(shortName)) {
        resetUnselectedOptions(shortName);
      }
      setValue(`${fieldArrayName}.${index}.weight`, 1);
      setValue(`${fieldArrayName}.${index}.isWeightSelectedByUser`, false);
    }
  };

  return (
    <GridContainer>
      <GridItem>
        <Button
          startIcon={<FontAwesomeIcon icon={faSliders} />}
          variant={'outlined'}
          onClick={() => setExpanded(true)}
        >
          <Trans>Adapt selection and weighting</Trans>
        </Button>
      </GridItem>
      <GridItem>
        <Fragment>
          <Drawer
            role="presentation"
            anchor={'left'}
            open={expanded}
            onClose={() => setExpanded(false)}
          >
            <GridContainer marginTop={10} spacing={1} width={400}>
              <GridItem xs={12} marginLeft={2}>
                <Typography variant="h2">
                  <Trans>Selection and weighting</Trans>
                </Typography>
              </GridItem>
              {watchedRatings.map(
                ({ shortName, weight, isWeightSelectedByUser }, index) => (
                  <GridItem xs={12} key={shortName}>
                    <GridContainer alignItems={'center'} spacing={2}>
                      <GridItem xs={2}>
                        <Checkbox
                          aria-label={`Select ${shortName}`}
                          checkedIcon={
                            shouldEnableExclusiveOptions(shortName) ? (
                              <FontAwesomeIcon size="lg" icon={faCircleCheck} />
                            ) : (
                              <FontAwesomeIcon size="lg" icon={faSquareCheck} />
                            )
                          }
                          icon={
                            shouldEnableExclusiveOptions(shortName) ? (
                              <FontAwesomeIcon size="lg" icon={faCircle} />
                            ) : (
                              <FontAwesomeIcon size="lg" icon={faSquare} />
                            )
                          }
                          aria-checked={weight !== 0}
                          checked={weight !== 0}
                          onChange={(e) =>
                            onCheckboxChanged(e, shortName, index)
                          }
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </GridItem>
                      <GridItem xs={2}>
                        <Typography>{shortName}</Typography>
                      </GridItem>
                      {weight !== 0 && (
                        <>
                          <GridItem>
                            <ReactHookFormSwitch
                              control={control}
                              name={`${fieldArrayName}.${index}.isWeightSelectedByUser`}
                              label={
                                !isWeightSelectedByUser && (
                                  <Trans>Select weight manually</Trans>
                                )
                              }
                            />
                          </GridItem>
                          <GridItem>
                            {isWeightSelectedByUser && (
                              <StyledDiv>
                                <ReactHookFormSelect
                                  control={control}
                                  size={'small'}
                                  name={`${fieldArrayName}.${index}.weight`}
                                  label={<Trans>Weight</Trans>}
                                  defaultValue={1}
                                >
                                  {WEIGHT_VALUES.slice(1).map(
                                    (weight, index) => (
                                      <MenuItem key={index} value={weight}>
                                        {weight}
                                      </MenuItem>
                                    )
                                  )}
                                </ReactHookFormSelect>
                              </StyledDiv>
                            )}
                          </GridItem>
                        </>
                      )}
                    </GridContainer>
                  </GridItem>
                )
              )}
              <GridItem xs={12}>
                <SaveButton
                  handleSubmit={handleSubmit}
                  onSaveClick={onSaveClick}
                />
              </GridItem>
            </GridContainer>
          </Drawer>
        </Fragment>
      </GridItem>
    </GridContainer>
  );
}
