import '@testing-library/jest-dom';
import { MatrixMockBuilder } from '../../testUtils/matrix';
import renderWithTheme from '../../testUtils/rendering';
import { screen } from '@testing-library/react';
import { MatrixRatingView, MatrixView } from './MatrixView';
import { describe, expect, it } from 'vitest';

describe('MatrixView', () => {
  it('renders matrix', () => {
    const matrix = new MatrixMockBuilder().build();
    renderWithTheme(<MatrixView matrix={matrix} />);
    matrix.ratings.forEach((r) => {
      expect(screen.getByText(r.shortName)).toBeInTheDocument();
    });
  });

  it('renders matrix rating', () => {
    const matrixRating = new MatrixMockBuilder().build().ratings[2];
    renderWithTheme(<MatrixRatingView matrixRating={matrixRating} />);
    expect(screen.getByText(matrixRating.shortName)).toBeInTheDocument();
    expect(screen.getByText(matrixRating.name)).toBeInTheDocument();
    expect(screen.getByText('Score reached')).toBeInTheDocument();
    expect(
      screen.getByText(`${matrixRating.points} / ${matrixRating.maxPoints}`)
    ).toBeInTheDocument();
    expect(screen.getByText('Percentage reached')).toBeInTheDocument();
    expect(
      screen.getByText(`${matrixRating.percentageReached!} %`)
    ).toBeInTheDocument();
  });

  it('renders matrix rating with unreasonable percentage', () => {
    const matrixRating = new MatrixMockBuilder().build().ratings[0];
    renderWithTheme(<MatrixRatingView matrixRating={matrixRating} />);
    expect(screen.getByText('Percentage reached')).toBeInTheDocument();
    expect(
      screen.getByText('No meaningful presentation possible')
    ).toBeInTheDocument();
  });

  it('renders matrix rating with weight zero', () => {
    const matrixRating = new MatrixMockBuilder().build().ratings[12];
    renderWithTheme(<MatrixRatingView matrixRating={matrixRating} />);
    expect(screen.getByText('Percentage reached')).toBeInTheDocument();
    expect(screen.getByText('Not considered in weighting')).toBeInTheDocument();
  });
});
