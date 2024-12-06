import '@testing-library/jest-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import renderWithTheme from '../../testUtils/rendering';
import PositiveRating from './PositiveRating.tsx';
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
    const evaluationLevels = [
      {
        level: 0,
        name: 'Vorbildlich',
        pointsFrom: 7,
        pointsTo: 10,
      },
      {
        level: 1,
        name: 'Erfahren',
        pointsFrom: 4,
        pointsTo: 6,
      },
      { level: 2, name: 'Fortgeschritten', pointsFrom: 2, pointsTo: 3 },
      {
        level: 3,
        name: 'Erste Schritte',
        pointsFrom: 1,
        pointsTo: 1,
      },
      { level: 4, name: 'Basislinie', pointsFrom: 0, pointsTo: 0 },
    ];

    return (
      <PositiveRating
        evaluationLevels={evaluationLevels}
        control={control}
        name={name}
      />
    );
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
