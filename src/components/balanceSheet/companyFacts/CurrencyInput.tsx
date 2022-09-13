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
  errorMessage?: string;
  registerKey: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  fullWidth: boolean;
};

// https://medium.com/reactbrasil/make-your-react-component-generic-with-typescript-497378515667

const CurrencyInput = <T extends unknown>({
  fullWidth,
  label,
  registerKey,
  register,
  required,
  error,
  errorMessage,
}: CurrencyInputProps<T>) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel htmlFor="outlined-adornment-amount">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-amount"
        {...register(registerKey, {
          valueAsNumber: true,
          required: required,
        })}
        startAdornment={<InputAdornment position="start">€</InputAdornment>}
        error={error}
        label={label}
      />
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

export default CurrencyInput;
