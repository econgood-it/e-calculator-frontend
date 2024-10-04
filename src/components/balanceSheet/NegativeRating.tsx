import { Slider, Typography } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import GridItem from '../layout/GridItem';
import GridContainer from '../layout/GridContainer';
import { useTranslation } from 'react-i18next';

type NegativeRatingProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

export function NegativeRating<T extends FieldValues>({
  control,
  name,
}: NegativeRatingProps<T>) {
  const { t } = useTranslation();
  const marks = [
    {
      value: -200,
      label: '-200',
    },
    {
      value: -150,
      label: '-150',
    },
    {
      value: -100,
      label: '-100',
    },
    {
      value: -50,
      label: '-50',
    },
    {
      value: 0,
      label: '0',
    },
  ];

  return (
    <Controller
      render={({ field }) => (
        <GridContainer alignItems="center" spacing={1}>
          <GridItem minWidth={380}>
            <Slider
              {...field}
              track="inverted"
              aria-label={name}
              color="secondary"
              min={-200}
              max={0}
              marks={marks}
            />
          </GridItem>
          <GridItem minWidth={200}>
            <GridContainer justifyContent="flex-end">
              <GridItem xs={12} md={'auto'}>
                <Typography variant={'h2'} color={'error'}>{`${
                  field.value
                } ${t`Points`}`}</Typography>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      )}
      control={control}
      name={name}
    />
  );
}
