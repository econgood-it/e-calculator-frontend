import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { renderHookWithTheme } from '../testUtils/rendering';
import { act, waitFor } from '@testing-library/react';
import { useApi } from './ApiProvider';
import ActiveBalanceSheetProvider, {
  useActiveBalanceSheet,
} from './ActiveBalanceSheetProvider';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAlert } from './AlertContext';
import { RatingType } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { ReactElement } from 'react';
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";

vi.mock('../contexts/ApiProvider');
vi.mock('../contexts/AlertContext');

describe('WithActiveBalanceSheet', () => {
  const apiMock = {
    getBalanceSheet: vi.fn(),
    updateBalanceSheet: vi.fn(),
  };

  const alertMock = {
    addSuccessAlert: vi.fn(),
  };
  const balanceSheetMockBuilder = new BalanceSheetMockBuilder();

  beforeEach(() => {
    apiMock.getBalanceSheet.mockResolvedValue(balanceSheetMockBuilder.build());
    (useAlert as Mock).mockImplementation(() => alertMock);
  });

  function Wrapper({ children }: { children: ReactElement }) {
    const initialPathForRouting = `/balancesheets/${
      balanceSheetMockBuilder.build().id
    }`;
    return (
      <MemoryRouter initialEntries={[initialPathForRouting]}>
        <Routes>
          <Route
            path={'/balancesheets/:balanceSheetId'}
            element={
              <ActiveBalanceSheetProvider>
                {children}
              </ActiveBalanceSheetProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  }

  it('updates ratings', async () => {
    const ratingsUpdate = [
      {
        shortName: 'A1.1',
        name: 'Menschenwürde in der Zulieferkette',
        estimations: 7,
        type: RatingType.aspect,
        isPositive: true,
        weight: 1.5,
        isWeightSelectedByUser: false,
        maxPoints: 0,
        points: 0,
      },
      {
        shortName: 'B1.1',
        name: 'Financial independence through equity financing',
        estimations: -20,
        type: RatingType.aspect,
        isPositive: true,
        weight: 2,
        isWeightSelectedByUser: true,
        maxPoints: 0,
        points: 0,
      },
    ];

    const balanceSheetMockBuilder = new BalanceSheetMockBuilder();

    const updatedBalanceSheet = balanceSheetMockBuilder
      .replaceRatings(ratingsUpdate)
      .buildResponseBody();
    apiMock.updateBalanceSheet.mockResolvedValue(updatedBalanceSheet);
    (useApi as Mock).mockImplementation(() => apiMock);
    const { result } = renderHookWithTheme(() => useActiveBalanceSheet(), {
      wrapper: Wrapper,
    });
    const { updateRatings } = result.current;

    await act(async () => {
      await updateRatings(ratingsUpdate);
    });

    await waitFor(() =>
      expect(apiMock.updateBalanceSheet).toHaveBeenCalledWith(
        balanceSheetMockBuilder.buildResponseBody().id,
        {
          ratings: [
            {
              shortName: ratingsUpdate[0].shortName,
              estimations: ratingsUpdate[0].estimations,
            },
            {
              shortName: ratingsUpdate[1].shortName,
              estimations: ratingsUpdate[1].estimations,
              weight: ratingsUpdate[1].weight,
            },
          ],
        }
      )
    );

    expect(result.current.balanceSheet).toEqual(updatedBalanceSheet);
  });

  it('updates companyfacts', async () => {
    const companyFactsUpdate = {
      totalPurchaseFromSuppliers: 40,
      supplyFractions: [
        {
          countryCode: 'GER',
          industryCode: 'Ce',
          costs: 38,
        },
      ],
      mainOriginOfOtherSuppliers: 'DEU',
    };
    const balanceSheetMockBuilder = new BalanceSheetMockBuilder();
    const updatedBalanceSheet = {
      ...balanceSheetMockBuilder.build(),
      companyFacts: {
        ...companyFactsUpdate,
        mainOriginOfOtherSuppliers: {
          countryCode: companyFactsUpdate.mainOriginOfOtherSuppliers,
          costs: 40,
        },
      },
    };

    apiMock.updateBalanceSheet.mockResolvedValue(updatedBalanceSheet);
    (useApi as Mock).mockImplementation(() => apiMock);
    const { result } = renderHookWithTheme(() => useActiveBalanceSheet(), {
      wrapper: Wrapper,
    });
    const { updateCompanyFacts } = result.current;

    await act(async () => {
      await updateCompanyFacts(companyFactsUpdate);
    });

    await waitFor(() =>
      expect(apiMock.updateBalanceSheet).toHaveBeenCalledWith(
        balanceSheetMockBuilder.build().id,
        {
          companyFacts: companyFactsUpdate,
        }
      )
    );

    expect(result.current.balanceSheet).toEqual(updatedBalanceSheet);
  });
});
