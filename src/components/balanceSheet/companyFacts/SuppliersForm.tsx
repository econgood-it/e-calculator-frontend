import { z } from 'zod';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

const SuppliersForm = () => {
  const { t } = useTranslation('company-facts-view');

  const FormInputSchema = z.object({
    totalPurchaseFromSuppliers: z
      .number({
        invalid_type_error: t('Number expected'),
        required_error: t('Number expected'),
      })
      .positive(t('Number should be positive')),
  });

  const {
    register,
    formState: { errors },
  } = useForm<z.infer<typeof FormInputSchema>>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
  });

  return (
    <>
      <FormControl>
        <InputLabel htmlFor="outlined-adornment-amount">
          <Trans>Total purchases from suppliers</Trans>
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          {...register('totalPurchaseFromSuppliers', {
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
    </>
  );
};

export default SuppliersForm;
