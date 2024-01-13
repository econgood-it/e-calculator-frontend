import { FormControlLabel, Switch } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ReactNode } from 'react';

type ReactHookFormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: ReactNode;
};

export function ReactHookFormSwitch<T extends FieldValues>({
  name,
  label,
  control,
}: ReactHookFormSelectProps<T>) {
  return (
    <Controller
      render={({ field, fieldState }) => (
        <FormControlLabel
          control={<Switch checked={field.value} {...field} />}
          label={label}
          aria-label={name}
        />
      )}
      name={name}
      control={control}
    />
  );
}
