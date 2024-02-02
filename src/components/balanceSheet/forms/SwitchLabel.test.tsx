import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';
import { screen } from '@testing-library/react';
import SwitchLabel from './SwitchLabel';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import { describe, expect, it } from 'vitest';
import { zodResolver } from '@hookform/resolvers/zod';

describe('SwitchLabel', () => {
  function TestComponent({ label }: { label: string }) {
    const FormInputSchema = z.object({
      hasCanteen: z.boolean(),
    });
    const { control } = useForm<z.infer<typeof FormInputSchema>>({
      resolver: zodResolver(FormInputSchema),
      mode: 'onChange',
      defaultValues: { hasCanteen: false },
    });
    return (
      <SwitchLabel control={control} registerKey={'hasCanteen'} label={label} />
    );
  }

  it('shows switch with label and recognizes modification', async () => {
    const user = userEvent.setup();
    const label = 'Has Canteen';
    renderWithTheme(<TestComponent label={label} />);
    const switchField = screen.getByRole('checkbox', {
      name: label,
    });
    expect((switchField as HTMLInputElement).checked).toBeFalsy();
    await user.click(switchField);
    expect(switchField as HTMLInputElement).toBeTruthy();
  });
});
