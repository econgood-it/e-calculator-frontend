import { FormControl, InputLabel, Select } from '@mui/material';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';
import { SelectProps } from '@mui/material/Select/Select';

type ReactHookFormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  defaultValue: PathValue<T, Path<T>>;
};

export function ReactHookFormSelect<T extends FieldValues>({
  name,
  label,
  control,
  defaultValue,
  children,
}: ReactHookFormSelectProps<T> & SelectProps) {
  const labelId = `${name}-label`;
  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        render={({ field, fieldState }) => (
          <Select {...field} labelId={labelId} label={label}>
            {children}
          </Select>
        )}
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
    </FormControl>
  );
}
