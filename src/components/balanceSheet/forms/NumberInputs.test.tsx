import { z } from 'zod';
import '@testing-library/jest-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { NumberInput } from './NumberInputs';
import userEvent from '@testing-library/user-event';
import renderWithTheme from '../../../testUtils/rendering';
import { screen } from '@testing-library/react';

describe('NumberInput', () => {
  function TestComponent<T extends z.ZodTypeAny>({
    formSchema,
    defaultValues,
    registerKey,
    label,
  }: {
    formSchema: T;
    defaultValues: any;
    registerKey: any;
    label: string;
  }) {
    const {
      register,
      formState: { errors },
    } = useForm<T>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: defaultValues,
    });
    return (
      <NumberInput
        errors={errors}
        register={register}
        label={label}
        registerKey={registerKey}
      />
    );
  }

  it('should render error if user input is invalid', async () => {
    const user = userEvent.setup();
    const errorMsg = 'Invalid value';
    const FormSchema = z.object({
      estimations: z.number().min(2, errorMsg).max(10, errorMsg),
    });
    const label = 'Estimations';
    renderWithTheme(
      <TestComponent
        formSchema={FormSchema}
        label={label}
        defaultValues={{ estimations: 9 }}
        registerKey={'estimations'}
      />
    );
    const numberInputField = screen.getByLabelText(label);
    await user.clear(numberInputField);
    await user.type(numberInputField, '-9');
    expect(numberInputField).toHaveValue('-9');
    expect(await screen.findByText(errorMsg)).toBeInTheDocument();
  });
});
