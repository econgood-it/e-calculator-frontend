import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NegativeRating from './NegativeRating';

describe('NegativeRating', () => {
  it('renders', () => {
    render(<NegativeRating val={-2} />);
    expect(screen.getByLabelText('negative-rating-input')).toHaveValue(-2);
    expect(
      screen.getByText('Wert zwischen -200 und 0 eintragen')
    ).toBeInTheDocument();
  });

  it('renders validation error if value > 0', async () => {
    render(<NegativeRating val={-2} />);
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: 9 },
    });

    await waitFor(() =>
      expect(
        screen.getByText('Wert sollte kleiner oder gleich 0 sein')
      ).toBeInTheDocument()
    );
  });
});
