import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import { screen } from '@testing-library/react';
import { ReactHookFormSwitch } from './ReactHookFormSwitch';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {describe, expect, it} from "vitest";
import {zodResolver} from "@hookform/resolvers/zod";

describe('ReactHookFormSwitch', () => {
  function TestComponent<T extends z.ZodTypeAny>({
    formSchema,
    defaultValues,
    name,
    label,
  }: {
    formSchema: T;
    defaultValues: any;
    name: any;
    label: string;
  }) {
    const { control } = useForm<T>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: defaultValues,
    });
    return <ReactHookFormSwitch control={control} name={name} label={label} />;
  }

  it('renders the updates flag on switch toggle', async () => {
    const FormSchema = z.object({
      isWeightSelectedByUser: z.boolean(),
    });
    const { user } = renderWithTheme(
      <TestComponent
        formSchema={FormSchema}
        name={'isWeightSelectedByUser'}
        label={'Use calculated weight'}
        defaultValues={{ isWeightSelectedByUser: false }}
      />
    );

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();
    await user.click(switchElement);
    expect(switchElement).toBeChecked();
  });
});
