import { Trans, useTranslation } from 'react-i18next';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CurrencyInput from './CurrencyInput';
import GridContainer from '../../layout/GridContainer';
import GridItem from '../../layout/GridItem';
import styled from 'styled-components';
import {
  CompanyFacts,
  CompanyFactsSchema,
} from '../../../dataTransferObjects/BalanceSheet';
import { Button, Typography } from '@mui/material';
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
  supplyFractions: true,
});

type SuppliersFormInput = z.infer<typeof SuppliersFormInputSchema>;

const SuppliersForm = ({ companyFacts }: SuppliersFormProps) => {
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<CompanyFacts>({
    resolver: zodResolver(SuppliersFormInputSchema),
    mode: 'onChange',
    defaultValues: companyFacts,
  });

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'supplyFractions', // unique name for your Field Array
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
        <Typography variant={'h6'}>
          <Trans>
            Enter the 5 most important industry sectors whose products or
            services you use.
          </Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3}>
          {fields.map((field, index) => (
            <GridItem key={index} xs={12}>
              <CurrencyInput<CompanyFacts>
                fullWidth
                label={<Trans>Costs</Trans>}
                error={!!errors.supplyFractions?.[index]?.costs}
                errorMessage={
                  !!errors.supplyFractions?.[index]?.costs &&
                  t(`${errors.supplyFractions?.[index]?.costs?.message}`)
                }
                register={register}
                registerKey={`supplyFractions.${index}.costs`}
                required={true}
              />
            </GridItem>
          ))}
        </GridContainer>
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
