import {
  BalanceSheetMocks,
  CompanyFactsMocks,
} from '../testUtils/balanceSheets';
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

const TestComponentUpdateRating = () => {
  const { balanceSheet, updateRating } = useActiveBalanceSheet();
  return (
    <>
      <Button
        onClick={() => {
          updateRating({
            shortName: 'A1.1',
            name: 'Menschenwürde in der Zulieferkette',
            estimations: 7,
            type: RatingType.aspect,
          });
        }}
      >
        Update Ratings
      </Button>
      {balanceSheet?.ratings.map((r) => (
        <div key={r.shortName}>{`Rating ${r.shortName}, ${r.estimations}`}</div>
      ))}
    </>
  );
};

const TestComponentUpdateCompanyFacts = () => {
  const { balanceSheet, updateCompanyFacts } = useActiveBalanceSheet();
  return (
    <>
      <Button
        onClick={() => {
          updateCompanyFacts({
            totalPurchaseFromSuppliers: 40,
            supplyFractions: [
              {
                countryCode: 'GER',
                industryCode: 'Ce',
                costs: 38,
              },
            ],
            mainOriginOfOtherSuppliers: 'DEU',
          });
        }}
      >
        Update CompanyFacts
      </Button>
      <div>{`Total purchase from suppliers, ${balanceSheet?.companyFacts.totalPurchaseFromSuppliers}`}</div>
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
          data: BalanceSheetMocks.balanceSheet1(),
        });
      }
    });
    (useAlert as jest.Mock).mockImplementation(() => alertMock);
  });

  it('updates ratings', async () => {
    apiMock.patch.mockImplementation((path: string, data) => {
      if (path === `v1/balancesheets/3`) {
        const updatedRating = data.ratings[0];
        const responseData = {
          ...BalanceSheetMocks.balanceSheet1(),
          ratings: BalanceSheetMocks.balanceSheet1().ratings.map((r) =>
            r.shortName === updatedRating.shortName
              ? { ...r, estimations: updatedRating.estimations }
              : r
          ),
        };
        return Promise.resolve({
          data: responseData,
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const initialPathForRouting = '/balancesheets/3';
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route
            path={'/balancesheets/:balanceSheetId'}
            element={
              <ActiveBalanceSheetProvider>
                <TestComponentUpdateRating />
              </ActiveBalanceSheetProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Rating A1.1, 0/)).toBeInTheDocument();
    await user.click(screen.getByText('Update Ratings'));
    expect(apiMock.patch).toHaveBeenCalledWith('v1/balancesheets/3', {
      ratings: [{ estimations: 7, shortName: 'A1.1' }],
    });
    expect(screen.getByText(/Rating A1.1, 7/)).toBeInTheDocument();
  });

  it('updates companyfacts', async () => {
    apiMock.patch.mockImplementation((path: string, data) => {
      if (path === `v1/balancesheets/3`) {
        const updatedCompanyFacts = {
          ...data.companyFacts,
          mainOriginOfOtherSuppliers: {
            countryCode:
              data.companyFacts.mainOriginOfOtherSuppliers.countryCode,
            costs: 40,
          },
        };
        const responseData = {
          ...BalanceSheetMocks.balanceSheet1(),
          companyFacts: updatedCompanyFacts,
        };
        return Promise.resolve({
          data: responseData,
        });
      }
    });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const initialPathForRouting = '/balancesheets/3';
    const user = userEvent.setup();
    renderWithTheme(
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route
            path={'/balancesheets/:balanceSheetId'}
            element={
              <ActiveBalanceSheetProvider>
                <TestComponentUpdateCompanyFacts />
              </ActiveBalanceSheetProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(
      await screen.findByText(
        `Total purchase from suppliers, ${
          CompanyFactsMocks.companyFacts1().totalPurchaseFromSuppliers
        }`
      )
    ).toBeInTheDocument();
    await user.click(screen.getByText('Update CompanyFacts'));
    expect(
      screen.getByText(`Total purchase from suppliers, 40`)
    ).toBeInTheDocument();
  });
});
