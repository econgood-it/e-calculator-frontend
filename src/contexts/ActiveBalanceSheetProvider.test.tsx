import { balanceSheetMock } from '../testUtils/balanceSheets';
import renderWithTheme from '../testUtils/rendering';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApi } from '../contexts/ApiContext';
import ActiveBalanceSheetProvider, {
  useActiveBalanceSheet,
} from './ActiveBalanceSheetProvider';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Button } from '@mui/material';
import userEvent from '@testing-library/user-event';
import { RatingType } from '../dataTransferObjects/Rating';
import { useAlert } from './AlertContext';

jest.mock('../contexts/ApiContext');
jest.mock('../contexts/AlertContext');

const TestComponent = () => {
  const { balanceSheet, updateRating } = useActiveBalanceSheet();
  return (
    <>
      <Button
        onClick={() =>
          updateRating({
            shortName: 'A1.1',
            name: 'Menschenwürde in der Zulieferkette',
            estimations: 7,
            type: RatingType.aspect,
          })
        }
      >
        Update Rating
      </Button>
      {balanceSheet?.ratings.map((r) => (
        <div key={r.shortName}>{`Rating ${r.shortName}, ${r.estimations}`}</div>
      ))}
    </>
  );
};

describe('WithActiveBalanceSheet', () => {
  const apiMock = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  const alertMock = {
    addSuccessAlert: jest.fn(),
  };

  beforeEach(() => {
    apiMock.get.mockImplementation((path: string) => {
      if (path === `v1/balancesheets/3`) {
        return Promise.resolve({
          data: { ...balanceSheetMock },
        });
      }
    });
    apiMock.patch.mockImplementation((path: string, data) => {
      if (path === `v1/balancesheets/3`) {
        const updatedRating = data.ratings[0];
        return Promise.resolve({
          data: {
            ...balanceSheetMock,
            ratings: balanceSheetMock.ratings.map((r) =>
              r.shortName === updatedRating.shortName
                ? { ...r, estimations: updatedRating.estimations }
                : r
            ),
          },
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    (useAlert as jest.Mock).mockImplementation(() => alertMock);
  });

  it('updates active balance sheet', async () => {
    const initialPathForRouting = '/balancesheets/3';
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route
            path={'/balancesheets/:balanceSheetId'}
            element={
              <ActiveBalanceSheetProvider>
                <TestComponent />
              </ActiveBalanceSheetProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Rating A1.1, 0/)).toBeInTheDocument();
    await user.click(screen.getByText('Update Rating'));
    expect(apiMock.patch).toHaveBeenCalledWith('v1/balancesheets/3', {
      ratings: [{ estimations: 7, shortName: 'A1.1' }],
    });
    expect(screen.getByText(/Rating A1.1, 7/)).toBeInTheDocument();
  });
});
