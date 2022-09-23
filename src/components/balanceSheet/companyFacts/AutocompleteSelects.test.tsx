import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';

import { regionsMocks } from '../../../testUtils/regions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegionSelect } from './AutocompleteSelect';
import { Region } from '../../../dataTransferObjects/Region';
import { screen } from '@testing-library/react';
describe('RegionSelect', () => {
  function TestComponent({ regions }: { regions: Region[] }) {
    const FormInputSchema = z.object({
      countryCode: z.string().max(3),
    });
    const { control } = useForm<z.infer<typeof FormInputSchema>>({
      resolver: zodResolver(FormInputSchema),
      mode: 'onChange',
      defaultValues: { countryCode: 'BEL' },
    });
    return (
      <RegionSelect name={`countryCode`} regions={regions} control={control} />
    );
  }

  it('shows found region when searching for a region name', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TestComponent regions={regionsMocks.regions1()} />);
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
});
