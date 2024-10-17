import GridItem from '../../layout/GridItem';
import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { CurrencyInput, PercentageInput } from '../forms/NumberInputs';
import GridContainer from '../../layout/GridContainer';
import {
  Control,
  FormState,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';

import { DEFAULT_CODE, IndustrySelect } from './AutocompleteSelects';
import SwitchLabel from '../forms/SwitchLabel';
import { FieldArrayAppendButton } from '../forms/FieldArrayAppendButton';
import { FieldArrayRemoveButton } from '../forms/FieldArrayRemoveButton';
import { Industry } from '../../../models/Industry';
import { CompanyFacts } from '../../../models/CompanyFacts.ts';

type CustomersFormProps = {
  control: Control<CompanyFacts>;
  register: UseFormRegister<CompanyFacts>;
  formState: FormState<CompanyFacts>;
  industries: Industry[];
};

export function CustomersForm({
  control,
  industries,
  register,
  formState: { errors },
}: CustomersFormProps) {
  const { t } = useTranslation();

  const fieldArrayName = 'industrySectors';
  const {
    fields: industrySectors,
    append,
    remove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: fieldArrayName, // unique name for your Field Array
  });

  return (
    <GridContainer spacing={3}>
      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems="center">
          <GridItem xs={12} sm={6}>
            <CurrencyInput<CompanyFacts>
              register={register}
              errors={errors}
              registerKey={'turnover'}
              label={<Trans>Turnover</Trans>}
            />
          </GridItem>
          <GridItem xs={12} sm={6}>
            <SwitchLabel<CompanyFacts>
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
                  <PercentageInput<CompanyFacts>
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
    </GridContainer>
  );
}
