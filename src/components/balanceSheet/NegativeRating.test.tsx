import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NegativeRating from './NegativeRating';

describe('NegativeRating', () => {
  const onEstimationsChange = jest
    .fn()
    .mockImplementation((value: number) => {});

  const onError = jest.fn();

  it('renders', () => {
    render(
      <NegativeRating
        readOnly={false}
        estimations={0}
        onEstimationsChange={onEstimationsChange}
        onError={onError}
      />
    );
    expect(screen.getByLabelText('negative-rating-input')).toHaveValue(0);
    expect(
      screen.getByText('Wert zwischen -200 und 0 eintragen')
    ).toBeInTheDocument();
  });

  it('triggers onChange if user changes value', async () => {
    render(
      <NegativeRating
        readOnly={false}
        estimations={0}
        onEstimationsChange={onEstimationsChange}
        onError={onError}
      />
    );
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: -20 },
    });
    await waitFor(() => expect(onEstimationsChange).toHaveBeenCalledWith(-20));
  });

  it('renders validation error if value > 0', async () => {
    render(
      <NegativeRating
        readOnly={false}
        estimations={-2}
        onEstimationsChange={onEstimationsChange}
        onError={onError}
      />
    );
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: 9 },
    });

    await waitFor(() =>
      expect(
        screen.getByText('Wert sollte kleiner oder gleich 0 sein')
      ).toBeInTheDocument()
    );
    expect(onError).toHaveBeenCalled();
    expect(onEstimationsChange).not.toHaveBeenCalled();
  });

  it('renders validation error if value < -200', async () => {
    render(
      <NegativeRating
        readOnly={false}
        estimations={0}
        onEstimationsChange={onEstimationsChange}
        onError={onError}
      />
    );
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: -201 },
    });

    await waitFor(() =>
      expect(
        screen.getByText('Wert sollte größer oder gleich -200 sein')
      ).toBeInTheDocument()
    );
    expect(onError).toHaveBeenCalled();
    expect(onEstimationsChange).not.toHaveBeenCalled();
  });

  it('renders validation error if value not a number', async () => {
    render(
      <NegativeRating
        readOnly={false}
        estimations={0}
        onEstimationsChange={onEstimationsChange}
        onError={onError}
      />
    );
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: '-2hallo' },
    });

    await waitFor(() =>
      expect(screen.getByText('Zahl erwartet')).toBeInTheDocument()
    );
    expect(onError).toHaveBeenCalled();
    expect(onEstimationsChange).not.toHaveBeenCalled();
  });
});
