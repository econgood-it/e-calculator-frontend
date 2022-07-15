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

jest.mock('../contexts/ApiContext');

const TestComponent = () => {
  const { balanceSheet, updateRating } = useActiveBalanceSheet();
  return (
    <>
      <Button
        onClick={() =>
          updateRating({
            shortName: 'A1',
            name: 'Menschenwürde in der Zulieferkette',
            estimations: 7,
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
  };
  beforeEach(() => {
    apiMock.get.mockImplementation((path: string) => {
      if (path === `v1/balancesheets/3`) {
        return Promise.resolve({
          data: { ...balanceSheetMock, id: 3 },
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
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
    expect(await screen.findByText(/Rating A1, 0/)).toBeInTheDocument();
    await user.click(screen.getByText('Update Rating'));
    expect(screen.getByText(/Rating A1, 7/)).toBeInTheDocument();
  });
});
