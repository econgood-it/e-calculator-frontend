import GridContainer from '../layout/GridContainer.tsx';
import GridItem from '../layout/GridItem.tsx';
import {
  Card,
  CardContent,
  Checkbox,
  MenuItem,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from 'react-i18next';
import { ChangeEvent, useCallback, useMemo } from 'react';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { ReactHookFormSwitch } from '../lib/ReactHookFormSwitch.tsx';
import { ReactHookFormSelect } from '../lib/ReactHookFormSelect.tsx';
import {
  BalanceSheetVersion,
  WEIGHT_VALUES,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';
import {
  faCircle,
  faCircleCheck,
  faSquare,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { gte } from '@mr42/version-comparator/dist/version.comparator';

import { RatingsFormInput } from './RatingsForm.tsx';

type WeightConfiguratorProps = {
  control: Control<RatingsFormInput>;
  setValue: UseFormSetValue<RatingsFormInput>;
  version: BalanceSheetVersion;
};

export function WeightConfigurator({
  control,
  setValue,
  version,
}: WeightConfiguratorProps) {
  const fieldArrayName = 'ratings';
  const watchedRatings = useWatch({
    control,
    name: fieldArrayName,
  });
  const interactLikeUser = useMemo(
    () => ({
      shouldDirty: true, // This ensures the isDirty flag is updated
      shouldTouch: true, // Optional: sets field as touched
      shouldValidate: true, // Optional: triggers validation
    }),
    []
  );

  const exclusiveOptions = useMemo(() => ['B1.1', 'B1.2'], []);

  const shouldEnableExclusiveOptions = useCallback(
    (shortName: string) => {
      return (
        gte(version, BalanceSheetVersion.v5_1_0) &&
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
          const index = watchedRatings.findIndex((r) => r.shortName === option);
          setValue(`${fieldArrayName}.${index}.weight`, 0, interactLikeUser);
          setValue(
            `${fieldArrayName}.${index}.isWeightSelectedByUser`,
            true,
            interactLikeUser
          );
        });
    },
    [exclusiveOptions, watchedRatings, setValue, interactLikeUser]
  );

  const onCheckboxChanged = (
    event: ChangeEvent<HTMLInputElement>,
    shortName: string,
    index: number
  ) => {
    if (!event.target.checked) {
      setValue(`${fieldArrayName}.${index}.weight`, 0, interactLikeUser);
      setValue(
        `${fieldArrayName}.${index}.isWeightSelectedByUser`,
        true,
        interactLikeUser
      );
    } else {
      if (shouldEnableExclusiveOptions(shortName)) {
        resetUnselectedOptions(shortName);
      }
      setValue(`${fieldArrayName}.${index}.weight`, 1, interactLikeUser);
      setValue(
        `${fieldArrayName}.${index}.isWeightSelectedByUser`,
        false,
        interactLikeUser
      );
    }
  };

  return (
    <GridContainer spacing={1}>
      {watchedRatings.map(
        ({ shortName, weight, isWeightSelectedByUser, isPositive, type }, index) =>
          isPositive && (
            <GridItem xs={12} lg={4} key={shortName}>
              <Card>
                <CardContent>
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
                        onChange={(e) => onCheckboxChanged(e, shortName, index)}
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
                        <GridItem minWidth={100}>
                          {isWeightSelectedByUser && (
                            <ReactHookFormSelect
                              control={control}
                              size={'small'}
                              name={`${fieldArrayName}.${index}.weight`}
                              label={<Trans>Weight</Trans>}
                              defaultValue={1}
                            >
                              {WEIGHT_VALUES.slice(1).map((weight, index) => (
                                <MenuItem key={index} value={weight}>
                                  {weight}
                                </MenuItem>
                              ))}
                            </ReactHookFormSelect>
                          )}
                        </GridItem>
                      </>
                    )}
                  </GridContainer>
                  {weight === 0 && ( //gerrit edit
                    <Typography>
                      { type === 'aspect' && ( <Trans>If you can not report on this aspect, you must deselect the topic to assure points are not counted.</Trans> )}
                      { type === 'topic' && ( <Trans>You must explain in the common good report why this topic has been disabled.</Trans> )}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </GridItem>
          )
      )}
    </GridContainer>
  );
}
