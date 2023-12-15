import { Slider } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type NegativeRatingProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

export function NegativeRating<T extends FieldValues>({
  control,
  name,
}: NegativeRatingProps<T>) {
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
      render={({ field, fieldState }) => (
        <Slider
          getAriaValueText={() => field.value.toFixed()}
          valueLabelDisplay="auto"
          {...field}
          track="inverted"
          aria-label={name}
          color="secondary"
          min={-200}
          max={0}
          marks={marks}
        />
      )}
      control={control}
      name={name}
    />
  );
}
