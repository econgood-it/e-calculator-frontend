import GridItem from '../../layout/GridItem';
import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { CurrencyInput, PercentageInput } from '../forms/NumberInputs';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';
import { SaveButton } from '../forms/SaveButton';

import { DEFAULT_CODE, IndustrySelect } from './AutocompleteSelects';
import SwitchLabel from '../forms/SwitchLabel';
import { FormTitle } from './FormTitle';
import { FieldArrayAppendButton } from '../forms/FieldArrayAppendButton';
import { FieldArrayRemoveButton } from '../forms/FieldArrayRemoveButton';
import { CompanyFactsResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/company.facts.dto';
import { Industry } from '../../../models/Industry';

const CustomersFormSchema = CompanyFactsResponseBodySchema.pick({
  turnover: true,
  industrySectors: true,
  isB2B: true,
});
type CustomersFormInput = z.infer<typeof CustomersFormSchema>;

type CustomersFormProps = {
  formData: CustomersFormInput;
  industries: Industry[];
};

export function CustomersForm({ formData, industries }: CustomersFormProps) {
  const { t } = useTranslation();
  const { updateCompanyFacts } = useActiveBalanceSheet();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<CustomersFormInput>({
    resolver: zodResolver(CustomersFormSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const fieldArrayName = 'industrySectors';
  const {
    fields: industrySectors,
    append,
    remove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: fieldArrayName, // unique name for your Field Array
  });

  const onSaveClick = async (data: FieldValues) => {
    await updateCompanyFacts(CustomersFormSchema.parse(data));
  };

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <FormTitle precedingCharacter={'D'} title={t`Customers`} />
      </GridItem>
      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems="center">
          <GridItem xs={12} sm={6}>
            <CurrencyInput<CustomersFormInput>
              register={register}
              errors={errors}
              registerKey={'turnover'}
              label={<Trans>Turnover</Trans>}
            />
          </GridItem>
          <GridItem xs={12} sm={6}>
            <SwitchLabel<CustomersFormInput>
              control={control}
              registerKey={'isB2B'}
              label={t`Are your customers mainly other companies?`}
            />
          </GridItem>
          <GridItem xs={12}>
            <Typography variant={'h2'}>
              <Trans>
                Enter the 3 most important industry sectors which your company
                is active in, including a rough share of turnover
              </Trans>
            </Typography>
          </GridItem>
          <GridItem xs={12}>
            <FieldArrayAppendButton
              label={<Trans>Add industry sector</Trans>}
              onClick={() =>
                append({
                  industryCode: undefined,
                  amountOfTotalTurnover: 0,
                  description: '',
                })
              }
            ></FieldArrayAppendButton>
          </GridItem>
          {industrySectors.map((_, index) => (
            <GridItem key={index} xs={12}>
              <GridContainer spacing={3}>
                <GridItem xs={12} sm={6}>
                  <IndustrySelect
                    control={control}
                    industries={industries}
                    defaultValue={DEFAULT_CODE}
                    name={`${fieldArrayName}.${index}.industryCode`}
                  />
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <PercentageInput<CustomersFormInput>
                    register={register}
                    errors={errors}
                    label={<Trans>Amount in %</Trans>}
                    registerKey={`${fieldArrayName}.${index}.amountOfTotalTurnover`}
                  />
                </GridItem>
                <GridItem xs={12} sm={1}>
                  <FieldArrayRemoveButton
                    onClick={() => remove(index)}
                    ariaLabel={`Remove ${fieldArrayName} with ${index}`}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          ))}
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
}
