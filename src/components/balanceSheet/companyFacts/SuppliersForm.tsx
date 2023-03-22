import { Trans, useTranslation } from 'react-i18next';
import { FieldValues, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CurrencyInput } from '../forms/NumberInputs';
import GridContainer, { FormContainer } from '../../layout/GridContainer';
import GridItem from '../../layout/GridItem';
import { Typography } from '@mui/material';
import { z } from 'zod';
import { useActiveBalanceSheet } from '../../../contexts/ActiveBalanceSheetProvider';

import {
  DEFAULT_CODE,
  IndustrySelect,
  RegionSelect,
} from './AutocompleteSelects';

import { useEffect } from 'react';
import { SaveButton } from '../forms/SaveButton';
import { FormTitle } from './FormTitle';
import { FieldArrayAppendButton } from '../forms/FieldArrayAppendButton';
import { FieldArrayRemoveButton } from '../forms/FieldArrayRemoveButton';
import { Region } from '../../../models/Region';
import { Industry } from '../../../models/Industry';
import { CompanyFactsResponseBodySchema } from 'e-calculator-schemas/dist/company.facts.dto';

const SuppliersFormInputSchema = CompanyFactsResponseBodySchema.pick({
  totalPurchaseFromSuppliers: true,
  supplyFractions: true,
  mainOriginOfOtherSuppliers: true,
});
type SuppliersFormInput = z.infer<typeof SuppliersFormInputSchema>;

type SuppliersFormProps = {
  formData: SuppliersFormInput;
  regions: Region[];
  industries: Industry[];
};

const SuppliersForm = ({
  formData,
  regions,
  industries,
}: SuppliersFormProps) => {
  const { updateCompanyFacts } = useActiveBalanceSheet();
  const { t } = useTranslation();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm<SuppliersFormInput>({
    resolver: zodResolver(SuppliersFormInputSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

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
  }, [watchedTotalPurchaseFromSuppliers, watchedSupplyFractions]);

  const onSaveClick = async (data: FieldValues) => {
    const newCompanyFacts = SuppliersFormInputSchema.parse(data);
    await updateCompanyFacts({
      ...newCompanyFacts,
      supplyFractions: newCompanyFacts.supplyFractions.map((sf) => {
        const countryCode =
          sf.countryCode === DEFAULT_CODE ? undefined : sf.countryCode;
        const industryCode =
          sf.industryCode === DEFAULT_CODE ? undefined : sf.industryCode;
        return { ...sf, countryCode: countryCode, industryCode: industryCode };
      }),
      mainOriginOfOtherSuppliers:
        newCompanyFacts.mainOriginOfOtherSuppliers.countryCode,
    });
  };

  return (
    <FormContainer spacing={3}>
      <GridItem>
        <FormTitle precedingCharacter={'A'} title={t`Suppliers`} />
      </GridItem>
      <GridItem xs={12}>
        <CurrencyInput<SuppliersFormInput>
          register={register}
          errors={errors}
          label={<Trans>Total purchases from suppliers</Trans>}
          registerKey={'totalPurchaseFromSuppliers'}
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
        <FieldArrayAppendButton
          onClick={() =>
            append({
              countryCode: undefined,
              industryCode: undefined,
              costs: 0,
            })
          }
        ></FieldArrayAppendButton>
      </GridItem>
      {supplyFractions.map((sf, index) => (
        <GridItem key={index} xs={12}>
          <GridContainer spacing={3}>
            <GridItem xs={12} sm={5}>
              <IndustrySelect
                control={control}
                industries={industries}
                defaultValue={DEFAULT_CODE}
                name={`${fieldArrayName}.${index}.industryCode`}
              />
            </GridItem>
            <GridItem xs={12} sm={5}>
              <RegionSelect
                control={control}
                regions={regions}
                defaultValue={DEFAULT_CODE}
                name={`${fieldArrayName}.${index}.countryCode`}
              />
            </GridItem>
            <GridItem xs={12} sm={1}>
              <CurrencyInput<SuppliersFormInput>
                register={register}
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
          <GridItem xs={12} sm={5}>
            <Typography variant="body1">
              <Trans>Main origin of the other suppliers</Trans>
            </Typography>
          </GridItem>
          <GridItem xs={12} sm={5}>
            <RegionSelect
              control={control}
              regions={regions}
              defaultValue={DEFAULT_CODE}
              name={`mainOriginOfOtherSuppliers.countryCode`}
            />
          </GridItem>
          <GridItem xs={12} sm={1}>
            <CurrencyInput
              register={register}
              errors={errors}
              label={<Trans>Costs</Trans>}
              readOnly={true}
              registerKey={'mainOriginOfOtherSuppliers.costs'}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={12}>
        <SaveButton handleSubmit={handleSubmit} onSaveClick={onSaveClick} />
      </GridItem>
    </FormContainer>
  );
};

export default SuppliersForm;
