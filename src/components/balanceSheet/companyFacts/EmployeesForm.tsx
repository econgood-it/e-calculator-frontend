import GridItem from '../../layout/GridItem';
import { Trans, useTranslation } from 'react-i18next';
import {
  CurrencyInput,
  NumberInput,
  PercentageInput,
} from '../forms/NumberInputs';
import GridContainer from '../../layout/GridContainer';
import { Control, FormState, useFieldArray } from 'react-hook-form';
import SwitchLabel from '../forms/SwitchLabel';

import { DEFAULT_CODE, RegionSelect } from './AutocompleteSelects';
import { FieldArrayAppendButton } from '../forms/FieldArrayAppendButton';
import { FieldArrayRemoveButton } from '../forms/FieldArrayRemoveButton';
import { Region } from '../../../models/Region';
import { CompanyFacts } from '../../../models/CompanyFacts.ts';

type EmployeesFormProps = {
  control: Control<CompanyFacts>;
  formState: FormState<CompanyFacts>;
  regions: Region[];
};

export function EmployeesForm({
  control,
  formState: { errors },
  regions,
}: EmployeesFormProps) {
  const { t } = useTranslation();
  const fieldArrayName = 'employeesFractions';
  const {
    fields: employeesFractions,
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
          <GridItem xs={12} sm={3}>
            <NumberInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'numberOfEmployees'}
              label={t`Number of employees (full time equivalents)`}
            />
          </GridItem>
          <GridItem xs={12} sm={3}>
            <CurrencyInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'totalStaffCosts'}
              label={t`Staff costs (gross without employer contribution)`}
            />
          </GridItem>
          <GridItem xs={12} sm={3}>
            <NumberInput<CompanyFacts>
              control={control}
              errors={errors}
              registerKey={'averageJourneyToWorkForStaffInKm'}
              label={t`Average journey to work for staff (in km)`}
            />
          </GridItem>
          <GridItem key={'hasCanteen'} xs={12} sm={3}>
            <SwitchLabel<CompanyFacts>
              control={control}
              registerKey={'hasCanteen'}
              label={t`Is there a canteen for the majority of staff?`}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <FieldArrayAppendButton
          label={<Trans>Add employees origin</Trans>}
          onClick={() => append({ countryCode: undefined, percentage: 0 })}
          disabled={false}
        ></FieldArrayAppendButton>
      </GridItem>
      {employeesFractions.map((_, index) => (
        <GridItem key={index} xs={12}>
          <GridContainer spacing={3}>
            <GridItem xs={12} sm={6}>
              <RegionSelect
                control={control}
                regions={regions}
                defaultValue={DEFAULT_CODE}
                name={`${fieldArrayName}.${index}.countryCode`}
              />
            </GridItem>
            <GridItem xs={12} sm={5}>
              <PercentageInput<CompanyFacts>
                control={control}
                errors={errors}
                label={<Trans>Amount in %</Trans>}
                registerKey={`${fieldArrayName}.${index}.percentage`}
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
  );
}
