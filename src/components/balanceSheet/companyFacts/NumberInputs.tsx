import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { ReactElement } from 'react';

type PositiveNumberInputProps<T> = {
  label: ReactElement | string;
  error: boolean;
  errorMessage?: string | boolean;
  registerKey: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  fullWidth: boolean;
  readOnly?: boolean;
  startAdornment?: ReactElement;
};

export function NumberInput<T extends FieldValues>({
  fullWidth,
  label,
  registerKey,
  register,
  required,
  error,
  errorMessage,
  readOnly,
  startAdornment,
}: PositiveNumberInputProps<T>) {
  const id = `outlined-adornment-amount_${registerKey}`;
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        readOnly={readOnly}
        id={id}
        {...register(registerKey, {
          valueAsNumber: true,
          required: required,
        })}
        aria-label={registerKey}
        startAdornment={startAdornment}
        error={error}
        label={label}
      />
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
}

export function CurrencyInput<T extends FieldValues>(
  props: PositiveNumberInputProps<T>
) {
  return (
    <NumberInput
      {...props}
      startAdornment={<InputAdornment position="start">€</InputAdornment>}
    />
  );
}

export function PercentageInput<T extends FieldValues>(
  props: PositiveNumberInputProps<T>
) {
  return (
    <NumberInput
      {...props}
      startAdornment={<InputAdornment position="start">%</InputAdornment>}
    />
  );
}
