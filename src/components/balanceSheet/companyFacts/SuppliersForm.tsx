import { Trans } from 'react-i18next';
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

const FormContainer = styled(GridContainer)`
  padding: 10px;
`;

type SuppliersFormProps = {
  companyFacts: CompanyFacts;
};

const SuppliersForm = ({ companyFacts }: SuppliersFormProps) => {
  const {
    register,
    formState: { errors },
  } = useForm<CompanyFacts>({
    resolver: zodResolver(CompanyFactsSchema),
    mode: 'onChange',
    defaultValues: companyFacts,
  });

  return (
    <FormContainer spacing={2}>
      <GridItem xs={12}>
        <CurrencyInput<CompanyFacts>
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
