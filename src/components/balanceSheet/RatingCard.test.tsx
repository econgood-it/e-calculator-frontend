import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import userEvent from '@testing-library/user-event';
import RatingCard from './RatingCard';
import { Rating, RatingType } from '../../dataTransferObjects/Rating';
import { screen } from '@testing-library/react';

describe('RatingCard', () => {
  it('renders and triggers onSave if user modifies rating', async () => {
    const onSave = jest.fn().mockImplementation((rating: Rating) => {});
    const rating: Rating = {
      shortName: 'A1.1',
      estimations: 0,
      name: 'A1.1 name',
      type: RatingType.aspect,
    };
    const user = userEvent.setup();
    renderWithTheme(<RatingCard rating={rating} onChange={onSave} />);
    expect(screen.getByLabelText('positive-rating-input')).toHaveClass(
      'MuiRating-readyOnly'
    );
    const editButton = screen.getByRole('button', { name: 'edit rating' });
    await user.click(editButton);
    const nineStars = screen.getByLabelText('9 Stars');
    await user.click(nineStars);
    const saveButton = screen.getByRole('button', { name: 'save rating' });
    await user.click(saveButton);
    expect(onSave).toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'edit rating' })
    ).toBeInTheDocument();
  });
});
