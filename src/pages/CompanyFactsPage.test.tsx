import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import renderWithTheme from '../testUtils/rendering';
import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import { BalanceSheetMocks } from '../testUtils/balanceSheets';
import { regionsMocks } from '../testUtils/regions';
import CompanyFactsPage from './CompanyFactsPage';
import { useApi } from '../contexts/ApiContext';
import { industriesMocks } from '../testUtils/industries';
import { useAlert } from '../contexts/AlertContext';

jest.mock('../contexts/ActiveBalanceSheetProvider');
jest.mock('../contexts/AlertContext');

jest.mock('../contexts/ApiContext');
describe('CompanyFactsPage', () => {
  const apiMock = {
    getRegions: jest.fn(),
    getIndustries: jest.fn(),
  };
  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ addErrorAlert: jest.fn() });
    (useActiveBalanceSheet as jest.Mock).mockReturnValue({
      balanceSheet: BalanceSheetMocks.balanceSheet1(),
    });
    apiMock.getRegions.mockResolvedValue(regionsMocks.regions1());
    apiMock.getIndustries.mockResolvedValue(industriesMocks.industries1());
    (useApi as jest.Mock).mockImplementation(() => apiMock);
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
