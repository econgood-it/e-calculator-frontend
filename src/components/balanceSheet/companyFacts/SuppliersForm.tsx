import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CurrencyInput from './CurrencyInput';
import GridContainer from '../../layout/GridContainer';
import GridItem from '../../layout/GridItem';
import styled from 'styled-components';
import {
  CompanyFacts,
  CompanyFactsSchema,
} from '../../../dataTransferObjects/BalanceSheet';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';

const FormContainer = styled(GridContainer)`
  padding: 10px;
`;

type SuppliersFormProps = {
  companyFacts: CompanyFacts;
};

const SuppliersFormInputSchema = CompanyFactsSchema.pick({
  totalPurchaseFromSuppliers: true,
});

type SuppliersFormInput = z.infer<typeof SuppliersFormInputSchema>;

const SuppliersForm = ({ companyFacts }: SuppliersFormProps) => {
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CompanyFacts>({
    resolver: zodResolver(SuppliersFormInputSchema),
    mode: 'onChange',
    defaultValues: companyFacts,
  });

  const onSaveClick = async (data: SuppliersFormInput) => {
    const newCompanyFacts = SuppliersFormInputSchema.parse(data);
    await updateCompanyFacts(newCompanyFacts);
  };

  return (
    <FormContainer spacing={2}>
      <GridItem xs={12}>
        <CurrencyInput<CompanyFacts>
          fullWidth
          label={<Trans>Total purchases from suppliers</Trans>}
          error={!!errors.totalPurchaseFromSuppliers}
          errorMessage={
            !!errors.totalPurchaseFromSuppliers &&
            t(`${errors.totalPurchaseFromSuppliers?.message}`)
          }
          register={register}
          registerKey={'totalPurchaseFromSuppliers'}
          required={true}
        />
      </GridItem>
      <GridItem xs={12}>
        <Button
          fullWidth={true}
          size={'large'}
          onClick={handleSubmit(onSaveClick)}
          variant={'contained'}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          <Trans>Save</Trans>
        </Button>
      </GridItem>
    </FormContainer>
  );
};

export default SuppliersForm;
