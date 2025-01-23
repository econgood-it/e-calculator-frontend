import { Trans } from 'react-i18next';
import {
  Control,
  FormState,
  useFieldArray,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { CurrencyInput } from '../forms/NumberInputs';
import GridContainer from '../../layout/GridContainer';
import GridItem from '../../layout/GridItem';
import { Typography } from '@mui/material';

import {
  DEFAULT_CODE,
  IndustrySelect,
  RegionSelect,
} from './AutocompleteSelects';

import { useEffect } from 'react';
import { FieldArrayAppendButton } from '../forms/FieldArrayAppendButton';
import { FieldArrayRemoveButton } from '../forms/FieldArrayRemoveButton';
import { Region } from '../../../models/Region';
import { Industry } from '../../../models/Industry';
import { CompanyFacts } from '../../../models/CompanyFacts.ts';

type SuppliersFormProps = {
  control: Control<CompanyFacts>;
  setValue: UseFormSetValue<CompanyFacts>;
  formState: FormState<CompanyFacts>;
  regions: Region[];
  industries: Industry[];
};

const SuppliersForm = ({
  control,
  setValue,
  formState: { errors },
  regions,
  industries,
}: SuppliersFormProps) => {
  const fieldArrayName = 'supplyFractions';
  const {
    fields: supplyFractions,
    append,
    remove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: fieldArrayName, // unique name for your Field Array
  });

  const watchedTotalPurchaseFromSuppliers = useWatch({
    control,
    name: 'totalPurchaseFromSuppliers',
  });
  const watchedSupplyFractions = useWatch({
    control,
    name: 'supplyFractions',
  });

  useEffect(() => {
    const sum: number =
      watchedTotalPurchaseFromSuppliers -
      watchedSupplyFractions.reduce((sum, current) => sum + current.costs, 0);
    setValue('mainOriginOfOtherSuppliers.costs', sum);
  }, [watchedTotalPurchaseFromSuppliers, watchedSupplyFractions, setValue]);

  return (
    <GridContainer spacing={3}>
      <GridItem xs={12}>
        <CurrencyInput<CompanyFacts>
          control={control}
          errors={errors}
          label={<Trans>Total purchases from suppliers</Trans>}
          registerKey={'totalPurchaseFromSuppliers'}
        />
      </GridItem>
      <GridItem xs={12}>
        <Typography variant={'h2'}>
          <Trans>
            Enter the 5 most important industry sectors whose products or
            services you use.
          </Trans>
        </Typography>
      </GridItem>
      <GridItem xs={12}>
        <FieldArrayAppendButton
          label={<Trans>Add supplier</Trans>}
          disabled={supplyFractions.length >= 5} //gerrit edit
          onClick={() =>
            append({
              countryCode: undefined,
              industryCode: undefined,
              costs: 0,
            })
          }
        ></FieldArrayAppendButton>
      </GridItem>
      {supplyFractions.map((_, index) => (
        <GridItem key={index} xs={12}>
          <GridContainer spacing={3}>
            <GridItem xs={12} sm={4}>
              <IndustrySelect
                control={control}
                industries={industries}
                defaultValue={DEFAULT_CODE}
                name={`${fieldArrayName}.${index}.industryCode`}
              />
            </GridItem>
            <GridItem xs={12} sm={4}>
              <RegionSelect
                control={control}
                regions={regions}
                defaultValue={DEFAULT_CODE}
                name={`${fieldArrayName}.${index}.countryCode`}
              />
            </GridItem>
            <GridItem xs={12} sm={3}>
              <CurrencyInput<CompanyFacts>
                control={control}
                errors={errors}
                label={<Trans>Costs</Trans>}
                registerKey={`${fieldArrayName}.${index}.costs`}
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

      <GridItem xs={12}>
        <GridContainer spacing={3} alignItems="center">
          <GridItem xs={12} sm={4}>
            <Typography variant="body1">
              <Trans>Main origin of the other suppliers</Trans>
            </Typography>
          </GridItem>
          <GridItem xs={12} sm={4}>
            <RegionSelect
              control={control}
              regions={regions}
              defaultValue={DEFAULT_CODE}
              name={`mainOriginOfOtherSuppliers.countryCode`}
            />
          </GridItem>
          <GridItem xs={12} sm={3}>
            <CurrencyInput
              control={control}
              errors={errors}
              label={<Trans>Costs</Trans>}
              readOnly={true}
              registerKey={'mainOriginOfOtherSuppliers.costs'}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
    </GridContainer>
  );
};

export default SuppliersForm;
