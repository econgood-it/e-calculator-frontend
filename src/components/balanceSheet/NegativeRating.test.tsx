import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { NegativeRating } from './NegativeRating';
import renderWithTheme from '../../testUtils/rendering';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

describe('NegativeRating', () => {
  function TestComponent<T extends z.ZodTypeAny>({
    formSchema,
    name,
    defaultValues,
  }: {
    formSchema: T;
    name: any;
    defaultValues: any;
  }) {
    const { control } = useForm<T>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: defaultValues,
    });
    return <NegativeRating control={control} name={name} />;
  }

  it('should update slider value', async () => {
    const FormSchema = z.object({
      estimations: z.number().min(0).max(200),
    });
    renderWithTheme(
      <TestComponent
        formSchema={FormSchema}
        name="estimations"
        defaultValues={{ estimations: 0 }}
      />
    );

    const slider = screen.getByLabelText('estimations');
    expect(slider).toHaveValue('0');

    fireEvent.change(slider, { target: { value: -104 } });

    expect(slider).toHaveValue('-104');
  });
});
