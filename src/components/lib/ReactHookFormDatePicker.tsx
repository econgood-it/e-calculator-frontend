import { FormControl } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ReactNode } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={label}
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) =>
                field.onChange(newValue ? newValue.toISOString() : '')
              }
              slotProps={{
                textField: {
                  variant: 'outlined',
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          </LocalizationProvider>
        )}
        name={name}
        control={control}
      />
    </FormControl>
  );
}
