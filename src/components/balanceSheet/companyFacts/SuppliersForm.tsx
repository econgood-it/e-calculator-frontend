import { z } from 'zod';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CurrencyInput from './CurrencyInput';
import GridContainer from '../../layout/GridContainer';
import GridItem from '../../layout/GridItem';
import styled from 'styled-components';

const FormContainer = styled(GridContainer)`
  padding: 10px;
`;

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

  type FormInput = z.infer<typeof FormInputSchema>;

  const {
    register,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
  });

  return (
    <FormContainer spacing={2}>
      <GridItem xs={12}>
        <CurrencyInput<FormInput>
          fullWidth
          label={<Trans>Total purchases from suppliers</Trans>}
          error={!!errors.totalPurchaseFromSuppliers}
          errorMessage={errors.totalPurchaseFromSuppliers?.message}
          register={register}
          registerKey={'totalPurchaseFromSuppliers'}
          required={true}
        />
      </GridItem>
    </FormContainer>
  );
};

export default SuppliersForm;
