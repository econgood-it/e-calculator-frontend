import { Slider, Typography } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import GridItem from '../layout/GridItem';
import GridContainer from '../layout/GridContainer';

type NegativeRatingProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

export function NegativeRating<T extends FieldValues>({
  control,
  name,
}: NegativeRatingProps<T>) {
  return (
    <Controller
      render={({ field, fieldState }) => (
        <GridContainer
          alignItems={'center'}
          justifyContent={'flex-end'}
          spacing={3}
        >
          <GridItem sx={{ width: 280 }}>
            <Slider
              getAriaValueText={() => field.value.toFixed()}
              {...field}
              track="inverted"
              aria-label={name}
              color="secondary"
              min={-200}
              max={0}
            />
          </GridItem>
          <GridItem sx={{ width: 200 }}>
            <Typography variant={'h2'}>{`${field.value} Points`}</Typography>
          </GridItem>
        </GridContainer>
      )}
      control={control}
      name={name}
    />
  );
}
