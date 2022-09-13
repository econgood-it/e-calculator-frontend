import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Trans } from 'react-i18next';
import { Path, UseFormRegister } from 'react-hook-form';

type CurrencyInputProps<T> = {
  label: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
};

// https://medium.com/reactbrasil/make-your-react-component-generic-with-typescript-497378515667

const CurrencyInput = <T extends unknown>({
  label,
  register,
  required,
}: CurrencyInputProps<T>) => {
  return (
    <FormControl>
      <InputLabel htmlFor="outlined-adornment-amount">
        <Trans>Total purchases from suppliers</Trans>
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-amount"
        {...register(label, {
          valueAsNumber: true,
        })}
        startAdornment={<InputAdornment position="start">€</InputAdornment>}
        error={!!errors.totalPurchaseFromSuppliers}
        label={t`Total purchases from suppliers`}
      />
      <FormHelperText>
        {errors.totalPurchaseFromSuppliers?.message}
      </FormHelperText>
    </FormControl>
  );
};

export default CurrencyInput;
