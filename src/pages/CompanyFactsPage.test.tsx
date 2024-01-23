import { screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { BalanceSheetMockBuilder } from '../testUtils/balanceSheets';
import { regionsMocks } from '../testUtils/regions';
import CompanyFactsPage from './CompanyFactsPage';
import { useApi } from '../contexts/ApiProvider';
import { industriesMocks } from '../testUtils/industries';
import { useAlert } from '../contexts/AlertContext';
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";


vi.mock('../contexts/ActiveBalanceSheetProvider');
vi.mock('../contexts/AlertContext');

vi.mock('../contexts/ApiProvider');
describe('CompanyFactsPage', () => {
  const apiMock = {
    getRegions: vi.fn(),
    getIndustries: vi.fn(),
  };
  beforeEach(() => {
    (useAlert as Mock).mockReturnValue({ addErrorAlert: vi.fn() });
    (useActiveBalanceSheet as Mock).mockReturnValue({
      balanceSheet: new BalanceSheetMockBuilder().build(),
    });
    apiMock.getRegions.mockResolvedValue(regionsMocks.regions1());
    apiMock.getIndustries.mockResolvedValue(industriesMocks.industries1());
    (useApi as Mock).mockImplementation(() => apiMock);
  });

  it('renders balance sheet items and navigates on click', async () => {
    renderWithTheme(<CompanyFactsPage />);
    await waitFor(() => expect(apiMock.getRegions).toHaveBeenCalledWith());
    await waitFor(() => expect(apiMock.getIndustries).toHaveBeenCalledWith());
  });

  it('renders forms', async () => {
    renderWithTheme(<CompanyFactsPage />);
    expect(await screen.findByText('Suppliers')).toBeInTheDocument();
    expect(
      await screen.findByText('Owners, equity- and financial service providers')
    ).toBeInTheDocument();
    expect(await screen.findByText('Employees')).toBeInTheDocument();

    expect(await screen.findByText('Customers')).toBeInTheDocument();
  });
});
