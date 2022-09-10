import '@testing-library/jest-dom';
import renderWithTheme from '../../testUtils/rendering';
import userEvent from '@testing-library/user-event';
import RatingCard from './RatingCard';
import { Rating, RatingType } from '../../dataTransferObjects/Rating';
import { screen } from '@testing-library/react';

describe('RatingCard', () => {
  const onRatingSaved = jest.fn().mockImplementation((rating: Rating) => {});
  it('renders and triggers onSave if user modifies rating', async () => {
    const rating: Rating = {
      shortName: 'A1.1',
      estimations: 0,
      name: 'A1.1 name',
      type: RatingType.aspect,
      isPositive: true,
    };
    const user = userEvent.setup();
    renderWithTheme(
      <RatingCard rating={rating} onRatingSaved={onRatingSaved} />
    );
    expect(screen.getByLabelText('positive-rating-input')).toHaveClass(
      'MuiRating-readyOnly'
    );
    const editButton = screen.getByRole('button', { name: 'edit rating' });
    await user.click(editButton);
    const nineStars = screen.getByLabelText('9 Stars');
    await user.click(nineStars);
    const saveButton = screen.getByRole('button', { name: 'save rating' });
    await user.click(saveButton);
    expect(onRatingSaved).toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'edit rating' })
    ).toBeInTheDocument();
  });

  it('renders positive or negative rating depending on value of isPositive', async () => {
    const rating = {
      shortName: 'A1.1',
      estimations: 0,
      name: 'A1.1 name',
      type: RatingType.aspect,
      isPositive: true,
    };
    renderWithTheme(
      <RatingCard rating={rating} onRatingSaved={onRatingSaved} />
    );
    expect(screen.getByLabelText('positive-rating-input')).toBeInTheDocument();

    renderWithTheme(
      <RatingCard
        rating={{ ...rating, isPositive: false }}
        onRatingSaved={onRatingSaved}
      />
    );
    expect(screen.getByLabelText('negative-rating-input')).toBeInTheDocument();
  });
});
