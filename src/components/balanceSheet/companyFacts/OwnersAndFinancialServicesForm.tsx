import { CompanyFactsSchema } from '../../../dataTransferObjects/CompanyFacts';
import GridItem from '../../layout/GridItem';
import { Button, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import CurrencyInput from './CurrencyInput';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { useAlert } from '../../../contexts/AlertContext';

const OwnersAndFinancialServicesFormSchema = CompanyFactsSchema.pick({
  profit: true,
  financialCosts: true,
  incomeFromFinancialInvestments: true,
  totalAssets: true,
  additionsToFixedAssets: true,
  financialAssetsAndCashBalance: true,
});
type OwnersAndFinancialServicesFormInput = z.infer<
  typeof OwnersAndFinancialServicesFormSchema
>;

type OwnersAndFinancialServicesFormProps = {
  formData: OwnersAndFinancialServicesFormInput;
};

export function OwnersAndFinancialServicesForm({
  formData,
}: OwnersAndFinancialServicesFormProps) {
  const { t } = useTranslation();
  const { addErrorAlert } = useAlert();
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<OwnersAndFinancialServicesFormInput>({
    resolver: zodResolver(OwnersAndFinancialServicesFormSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const onSaveClick = async (data: OwnersAndFinancialServicesFormInput) => {
    const newCompanyFacts = OwnersAndFinancialServicesFormSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
    });
  };

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <Typography variant={'h3'}>
          <Trans>Owners, equity- and financial service providers</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3}>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              fullWidth
              error={!!errors.profit}
              errorMessage={!!errors.profit && t(`${errors.profit?.message}`)}
              register={register}
              registerKey={'profit'}
              label={<Trans>Profit</Trans>}
              required={true}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              fullWidth
              error={!!errors.financialCosts}
              errorMessage={
                !!errors.financialCosts &&
                t(`${errors.financialCosts?.message}`)
              }
              register={register}
              registerKey={'financialCosts'}
              label={<Trans>Financial costs</Trans>}
              required={true}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              fullWidth
              error={!!errors.incomeFromFinancialInvestments}
              errorMessage={
                !!errors.incomeFromFinancialInvestments &&
                t(`${errors.incomeFromFinancialInvestments?.message}`)
              }
              register={register}
              registerKey={'incomeFromFinancialInvestments'}
              label={<Trans>Income from financial investments</Trans>}
              required={true}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              fullWidth
              error={!!errors.totalAssets}
              errorMessage={
                !!errors.totalAssets && t(`${errors.totalAssets?.message}`)
              }
              register={register}
              registerKey={'totalAssets'}
              label={<Trans>Total assets</Trans>}
              required={true}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              fullWidth
              error={!!errors.additionsToFixedAssets}
              errorMessage={
                !!errors.additionsToFixedAssets &&
                t(`${errors.additionsToFixedAssets?.message}`)
              }
              register={register}
              registerKey={'additionsToFixedAssets'}
              label={<Trans>Additions to fixed assets</Trans>}
              required={true}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              fullWidth
              error={!!errors.financialAssetsAndCashBalance}
              errorMessage={
                !!errors.financialAssetsAndCashBalance &&
                t(`${errors.financialAssetsAndCashBalance?.message}`)
              }
              register={register}
              registerKey={'financialAssetsAndCashBalance'}
              label={<Trans>Financial assets and cash balance</Trans>}
              required={true}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <Button
          fullWidth={true}
          size={'large'}
          onClick={handleSubmit(onSaveClick, () =>
            addErrorAlert(t`Form data is invalid`)
          )}
          variant={'contained'}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          <Trans>Save</Trans>
        </Button>
      </GridItem>
    </FormContainer>
  );
}
