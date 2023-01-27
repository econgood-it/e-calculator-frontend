import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Path, UseFormRegister } from 'react-hook-form';
import { ReactElement } from 'react';

type CurrencyInputProps<T> = {
  label: ReactElement;
  error: boolean;
  errorMessage?: string | boolean;
  registerKey: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  fullWidth: boolean;
  readOnly?: boolean;
};

const CurrencyInput = <T extends unknown>({
  fullWidth,
  label,
  registerKey,
  register,
  required,
  error,
  errorMessage,
  readOnly,
}: CurrencyInputProps<T>) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel htmlFor="outlined-adornment-amount">{label}</InputLabel>
      <OutlinedInput
        readOnly={readOnly}
        id="outlined-adornment-amount"
        {...register(registerKey, {
          valueAsNumber: true,
          required: required,
        })}
        aria-label={registerKey}
        startAdornment={<InputAdornment position="start">€</InputAdornment>}
        error={error}
        label={label}
      />
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

export default CurrencyInput;
