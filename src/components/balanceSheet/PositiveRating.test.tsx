import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import PositiveRating from './PositiveRating';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PositiveRating', () => {
  it('renders Erfahren', () => {
    const onChange = jest.fn();
    renderWithTheme(<PositiveRating value={5} onChange={onChange} />);
    expect(screen.getByText('Erfahren')).toBeInTheDocument();
  });

  it('renders calls onChange if value is changed', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithTheme(<PositiveRating value={5} onChange={onChange} />);
    const input = screen.getByLabelText('9 Stars');
    await user.click(input);
    expect(onChange).toHaveBeenCalled();
  });
});
