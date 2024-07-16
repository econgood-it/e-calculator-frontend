import GridItem from '../../layout/GridItem';
import { useTranslation } from 'react-i18next';
import { CurrencyInput } from '../forms/NumberInputs';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { SaveButton } from '../../buttons/SaveButton.tsx';
import { FormTitle } from './FormTitle';
import { CompanyFactsResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/company.facts.dto';

const OwnersAndFinancialServicesFormSchema =
  CompanyFactsResponseBodySchema.pick({
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
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<OwnersAndFinancialServicesFormInput>({
    resolver: zodResolver(OwnersAndFinancialServicesFormSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const onSaveClick = async (data: FieldValues) => {
    const newCompanyFacts = OwnersAndFinancialServicesFormSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
    });
  };

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <FormTitle
          precedingCharacter={'B'}
          title={t`Owners, equity- and financial service providers`}
        />
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3}>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              register={register}
              errors={errors}
              registerKey={'profit'}
              label={t`Profit`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              register={register}
              errors={errors}
              registerKey={'financialCosts'}
              label={t`Financial costs`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              register={register}
              errors={errors}
              registerKey={'incomeFromFinancialInvestments'}
              label={t`Income from financial investments`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              register={register}
              errors={errors}
              registerKey={'totalAssets'}
              label={t`Total assets`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              register={register}
              errors={errors}
              registerKey={'additionsToFixedAssets'}
              label={t`Additions to fixed assets`}
            />
          </GridItem>
          <GridItem xs={12} sm={4}>
            <CurrencyInput<OwnersAndFinancialServicesFormInput>
              register={register}
              errors={errors}
              registerKey={'financialAssetsAndCashBalance'}
              label={t`Financial assets and cash balance`}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}
