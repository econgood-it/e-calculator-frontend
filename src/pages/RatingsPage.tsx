import {
  RatingsForm,
  RatingsFormInput,
  RatingsFormSchema,
} from '../components/balanceSheet/RatingsForm';
import { Rating, StakholderShortNames } from '../models/Rating';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useSubmit,
} from 'react-router-dom';
import {
  createApiClient,
  makeWretchInstanceWithAuth,
} from '../api/api.client.ts';

import { API_URL } from '../configuration.ts';
import { useLoaderData } from 'react-router-typesafe';
import { WeightConfigurator } from '../components/balanceSheet/WeightConfigurators.tsx';
import GridContainer, {
  FormContainer,
} from '../components/layout/GridContainer.tsx';
import GridItem from '../components/layout/GridItem.tsx';
import { HandlerContext } from './handlerContext.ts';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveButton } from '../components/buttons/SaveButton.tsx';
import { Tab, Tabs } from '@mui/material';
import { Trans } from 'react-i18next';
import { faSliders } from '@fortawesome/free-solid-svg-icons/faSliders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SyntheticEvent, useState } from 'react';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';

export default function RatingsPage() {
  const data = useLoaderData<typeof loader>();
  const [tabValue, setTabValue] = useState(0);

  const { control, handleSubmit, setValue } = useForm<RatingsFormInput>({
    resolver: zodResolver(RatingsFormSchema),
    mode: 'onChange',
    defaultValues: { ratings: data?.ratings || [] },
    values: { ratings: data?.ratings || [] },
  });

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const submit = useSubmit();

  const onSave = async (dataFieldValues: FieldValues) => {
    const { ratings } = RatingsFormSchema.parse(dataFieldValues);
    submit({ ratings }, { method: 'patch', encType: 'application/json' });
  };

  return (
    <GridContainer>
      <GridItem
        position={'fixed'}
        zIndex={3}
        bgcolor={'white'}
        sx={{ width: '100%' }}
      >
        <GridContainer alignItems={'center'} padding={2} spacing={2}>
          <GridItem>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Select between ratings and weighting adaption"
            >
              <Tab
                icon={<FontAwesomeIcon icon={faSeedling} />}
                label={<Trans>Ratings</Trans>}
                iconPosition={'start'}
              />
              <Tab
                icon={<FontAwesomeIcon icon={faSliders} />}
                label={<Trans>Adapt selection and weighting</Trans>}
                iconPosition="start"
              />
            </Tabs>
          </GridItem>
          <GridItem>
            <SaveButton handleSubmit={handleSubmit} onSaveClick={onSave} />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem marginTop={4}>
        {data && (
          <FormContainer spacing={3} marginTop={6}>
            <GridItem xs={12}>
              {tabValue === 0 ? (
                <RatingsForm control={control} />
              ) : (
                <WeightConfigurator
                  control={control}
                  setValue={setValue}
                  version={data.balanceSheetVersion}
                />
              )}
            </GridItem>
          </FormContainer>
        )}
      </GridItem>
    </GridContainer>
  );
}

export async function loader(
  { params, request }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!userData) {
    return null;
  }

  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );
  const balanceSheet = await apiClient.getBalanceSheet(
    Number(params.balanceSheetId)
  );

  const pathMap: Record<string, StakholderShortNames> = {
    suppliers: StakholderShortNames.Suppliers,
    finance: StakholderShortNames.Finance,
    customers: StakholderShortNames.Customers,
    employees: StakholderShortNames.Employees,
    society: StakholderShortNames.Society,
  };
  const urlSplit = request.url.split('/');
  const lastSegment = urlSplit[urlSplit.length - 1];
  return {
    ratings: balanceSheet.ratings.filter((rating: Rating) =>
      rating.shortName.startsWith(pathMap[lastSegment])
    ),
    balanceSheetVersion: balanceSheet.version,
  };
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const data = await request.json();
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!userData) {
    return null;
  }

  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );
  return await apiClient.updateBalanceSheet(Number(params.balanceSheetId), {
    ratings: data.ratings.map((r: Rating) => ({
      shortName: r.shortName,
      estimations: r.estimations,
      weight: r.isWeightSelectedByUser ? r.weight : undefined,
    })),
  });
}
