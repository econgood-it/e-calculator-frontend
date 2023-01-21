import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';

import { regionsMocks } from '../../../testUtils/regions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegionSelect, IndustrySelect } from './AutocompleteSelects';
import { Region } from '../../../dataTransferObjects/Region';
import { screen } from '@testing-library/react';
import { Industry } from '../../../dataTransferObjects/Industry';
import { industriesMocks } from '../../../testUtils/industries';
describe('RegionSelect', () => {
  const defaultValue = 'defaultValue';
  function TestComponent({
    regions,
    countryCode,
  }: {
    regions: Region[];
    countryCode: string | undefined;
  }) {
    const FormInputSchema = z.object({
      countryCode: z.string().max(3),
    });
    const { control } = useForm<z.infer<typeof FormInputSchema>>({
      resolver: zodResolver(FormInputSchema),
      mode: 'onChange',
      defaultValues: { countryCode: countryCode },
    });
    return (
      <RegionSelect
        name={`countryCode`}
        regions={regions}
        control={control}
        defaultValue={defaultValue}
      />
    );
  }

  it('shows found region when searching for a region name', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TestComponent regions={regionsMocks.regions1()} countryCode={'BEL'} />
    );
    const searchField = screen.getByRole('combobox', {
      name: 'Choose a region',
    });
    const region = regionsMocks.regions1()[0];
    await user.type(searchField, region.countryName);
    expect(
      screen.getByRole('option', {
        name: `${region.countryCode} ${region.countryName}`,
      })
    );
  });

  it('shows Please select region when country code is undefined', async () => {
    renderWithTheme(
      <TestComponent
        regions={regionsMocks.regions1()}
        countryCode={undefined}
      />
    );
    expect(
      screen.getByRole('combobox', {
        name: 'Choose a region',
      })
    );
  });
});

describe('IndustrySelect', () => {
  const defaultValue = 'defaultValue';
  const defaultLabel = 'Choose an industry sector';
  function TestComponent({
    industries,
    industryCode,
  }: {
    industries: Industry[];
    industryCode: string | undefined;
  }) {
    const FormInputSchema = z.object({
      industryCode: z.string(),
    });
    const { control } = useForm<z.infer<typeof FormInputSchema>>({
      resolver: zodResolver(FormInputSchema),
      mode: 'onChange',
      defaultValues: { industryCode: industryCode },
    });
    return (
      <IndustrySelect
        name={`industryCode`}
        industries={industries}
        control={control}
        defaultValue={defaultValue}
      />
    );
  }

  it('shows found industry when searching for a industry name', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TestComponent
        industries={industriesMocks.industries1()}
        industryCode={'B'}
      />
    );
    const searchField = screen.getByRole('combobox', {
      name: defaultLabel,
    });
    const industry = industriesMocks.industries1()[0];
    await user.type(searchField, industry.industryName);
    expect(
      screen.getByRole('option', {
        name: `${industry.industryCode} - ${industry.industryName}`,
      })
    );
  });

  it(`shows ${defaultLabel} when industry code is undefined`, async () => {
    renderWithTheme(
      <TestComponent
        industries={industriesMocks.industries1()}
        industryCode={undefined}
      />
    );
    expect(
      screen.getByRole('combobox', {
        name: defaultLabel,
      })
    );
  });
});
