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

  const fieldKeyAndLabelMap: Map<
    keyof OwnersAndFinancialServicesFormInput,
    string
  > = new Map([
    ['profit', t`Profit`],
    ['financialCosts', t`Financial costs`],
    ['incomeFromFinancialInvestments', t`Income from financial investments`],
    ['totalAssets', t`Total assets`],
    ['additionsToFixedAssets', t`Additions to fixed assets`],
    ['financialAssetsAndCashBalance', t`Financial assets and cash balance`],
  ]);

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <Typography variant={'h3'}>
          <Trans>Owners, equity- and financial service providers</Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3}>
          {[...fieldKeyAndLabelMap.entries()].map(([key, label]) => (
            <GridItem key={key} xs={12} sm={4}>
              <CurrencyInput<OwnersAndFinancialServicesFormInput>
                fullWidth
                error={!!errors[key]}
                errorMessage={!!errors[key] && t(`${errors[key]?.message}`)}
                register={register}
                registerKey={key}
                label={label}
                required={true}
              />
            </GridItem>
          ))}
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <SaveButton<OwnersAndFinancialServicesFormInput>
          handleSubmit={handleSubmit}
          onSaveClick={onSaveClick}
        />
      </GridItem>
    </FormContainer>
  );
}
