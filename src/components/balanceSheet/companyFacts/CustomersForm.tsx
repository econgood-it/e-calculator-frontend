import { CompanyFactsSchema } from '../../../dataTransferObjects/CompanyFacts';
import GridItem from '../../layout/GridItem';
import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { CurrencyInput } from './NumberInputs';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { SaveButton } from './SaveButton';

const CustomersFormSchema = CompanyFactsSchema.pick({
  turnover: true,
});
type CustomersFormInput = z.infer<typeof CustomersFormSchema>;

type CustomersFormProps = {
  formData: CustomersFormInput;
};

export function CustomersForm({ formData }: CustomersFormProps) {
  const { t } = useTranslation();
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CustomersFormInput>({
    resolver: zodResolver(CustomersFormSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const onSaveClick = async (data: CustomersFormInput) => {
    const newCompanyFacts = CustomersFormSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
    });
  };

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <Typography variant={'h3'}>
          <Trans>Customers</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems="center">
          <GridItem xs={12} sm={3}>
            <CurrencyInput<CustomersFormInput>
              fullWidth
              error={!!errors.turnover}
              errorMessage={
                !!errors.turnover && t(`${errors.turnover?.message}`)
              }
              register={register}
              registerKey={'turnover'}
              label={<Trans>Turnover</Trans>}
              required={true}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <SaveButton<CustomersFormInput>
          handleSubmit={handleSubmit}
          onSaveClick={onSaveClick}
        />
      </GridItem>
    </FormContainer>
  );
}
