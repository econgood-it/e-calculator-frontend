import { FormControl } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ReactNode } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

type ReactHookFormDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: ReactNode;
};

export default function ReactHookFormDatePicker<T extends FieldValues>({
  name,
  label,
  control,
}: ReactHookFormDatePickerProps<T>) {
  return (
    <FormControl fullWidth>
      <Controller
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label={label}
            value={
              field.value && dayjs(field.value).isValid()
                ? dayjs(field.value)
                : null
            }
            onChange={(newValue) => {
              if (!newValue || !dayjs(newValue).isValid()) {
                field.onChange('');
                return;
              }
              field.onChange(newValue.toISOString());
            }}
            slotProps={{
              textField: {
                required: true,
                variant: 'outlined',
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
        name={name}
        control={control}
      />
    </FormControl>
  );
}
