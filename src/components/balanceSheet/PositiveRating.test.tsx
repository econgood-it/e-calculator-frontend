import '@testing-library/jest-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import renderWithTheme from '../../testUtils/rendering';
import PositiveRating from './PositiveRating';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { zodResolver } from '@hookform/resolvers/zod';

describe('PositiveRating', () => {
  function TestComponent<T extends z.ZodTypeAny>({
    formSchema,
    defaultValues,
    name,
  }: {
    formSchema: T;
    defaultValues: any; //eslint-disable-line
    name: any; //eslint-disable-line
    label: string;
  }) {
    const { control } = useForm<T>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: defaultValues,
    });
    return <PositiveRating control={control} name={name} />;
  }

  it('renders Vorbildlich', () => {
    const FormSchema = z.object({
      estimations: z.number().min(0).max(10),
    });
    const label = 'Estimations';
    renderWithTheme(
      <TestComponent
        formSchema={FormSchema}
        label={label}
        defaultValues={{ estimations: 9 }}
        name="estimations"
      />
    );
    expect(screen.getByText('Vorbildlich')).toBeInTheDocument();
  });

  it('updates level on rating change', async () => {
    const FormSchema = z.object({
      estimations: z.number().min(0).max(10),
    });
    const label = 'Estimations';
    renderWithTheme(
      <TestComponent
        formSchema={FormSchema}
        label={label}
        defaultValues={{ estimations: 9 }}
        name="estimations"
      />
    );
    const input = screen.getByLabelText('2 Stars');
    fireEvent.click(input);
    expect(await screen.findByText('Fortgeschritten')).toBeInTheDocument();
  });
});
