import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NegativeRating from './NegativeRating';

describe('NegativeRating', () => {
  it('renders', () => {
    const onChange = jest.fn();
    render(<NegativeRating value={0} onChange={onChange} />);
    expect(screen.getByLabelText('negative-rating-input')).toHaveValue(0);
    expect(
      screen.getByText('Wert zwischen -200 und 0 eintragen')
    ).toBeInTheDocument();
  });

  it('renders value -20', async () => {
    const onChange = jest.fn();
    render(<NegativeRating value={0} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: -20 },
    });
    expect(onChange).toHaveBeenCalledWith(-20);
  });

  it('renders validation error if value > 0', async () => {
    const onChange = jest.fn();
    render(<NegativeRating value={-2} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: 9 },
    });

    await waitFor(() =>
      expect(
        screen.getByText('Wert sollte kleiner oder gleich 0 sein')
      ).toBeInTheDocument()
    );
  });

  it('renders validation error if value < -200', async () => {
    const onChange = jest.fn();
    render(<NegativeRating value={0} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: -201 },
    });

    await waitFor(() =>
      expect(
        screen.getByText('Wert sollte größer oder gleich -200 sein')
      ).toBeInTheDocument()
    );
  });

  it('renders validation error if value not a number', async () => {
    const onChange = jest.fn();
    render(<NegativeRating value={0} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('negative-rating-input'), {
      target: { value: '-2hallo' },
    });

    await waitFor(() =>
      expect(screen.getByText('Zahl erwartet')).toBeInTheDocument()
    );
  });
});
