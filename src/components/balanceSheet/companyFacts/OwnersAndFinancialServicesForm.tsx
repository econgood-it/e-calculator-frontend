import GridItem from '../../layout/GridItem';
import { useTranslation } from 'react-i18next';
import { CurrencyInput } from '../forms/NumberInputs';
import GridContainer from '../../layout/GridContainer';
import { Control, FormState } from 'react-hook-form';
import { CompanyFacts } from '../../../models/CompanyFacts.ts';

type OwnersAndFinancialServicesFormProps = {
  control: Control<CompanyFacts>;
  formState: FormState<CompanyFacts>;
};

export function OwnersAndFinancialServicesForm({
  control,
  formState: { errors },
}: OwnersAndFinancialServicesFormProps) {
  const { t } = useTranslation();

  return (
    <GridContainer spacing={3}>
      <GridItem xs={12}>
        <GridContainer spacing={3}>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'profit'}
              label={t`EBIT (Earnings Before Interest and Taxes)`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'financialCosts'}
              label={t`Financial costs`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'incomeFromFinancialInvestments'}
              label={t`Income from financial investments`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'totalAssets'}
              label={t`Total assets`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'additionsToFixedAssets'}
              label={t`Additions to fixed assets`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'financialAssetsAndCashBalance'}
              label={t`Financial assets and cash balance`}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
    </GridContainer>
  );
}
