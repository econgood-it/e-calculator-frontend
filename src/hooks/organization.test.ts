import { useOrganization } from './organization';
import { renderHookWithTheme } from '../testUtils/rendering';
import { useApi } from '../contexts/ApiContext';
import {
  OrganizationItemsMocks,
  OrganizationMocks,
} from '../testUtils/organization';
import { waitFor } from '@testing-library/react';

jest.mock('../contexts/ApiContext');
describe('useOrganization', () => {
  const apiMock = {
    getOrganizations: jest.fn(),
    getOrganization: jest.fn(),
  };
  it('should return organization', async function () {
    apiMock.getOrganizations.mockResolvedValue(
      OrganizationItemsMocks.default()
    );
    const organization = OrganizationMocks.default();
    apiMock.getOrganization.mockResolvedValue(organization);
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = renderHookWithTheme(() => useOrganization());
    await waitFor(() =>
      expect(apiMock.getOrganizations).toHaveBeenCalledWith()
    );
    await waitFor(() =>
      expect(apiMock.getOrganization).toHaveBeenCalledWith(
        OrganizationItemsMocks.default()[0].id
      )
    );
    expect(result.current.organization).toEqual(organization);
  });

  it('should return undefined if organization items empty', async function () {
    apiMock.getOrganizations.mockResolvedValue([]);
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = renderHookWithTheme(() => useOrganization());
    await waitFor(() =>
      expect(apiMock.getOrganizations).toHaveBeenCalledWith()
    );
    expect(result.current.organization).toBeUndefined();
  });
});
