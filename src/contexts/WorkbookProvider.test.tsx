import { renderHookWithTheme } from '../testUtils/rendering';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApi } from './ApiContext';
import WorkbookProvider, { useWorkbook } from './WorkbookProvider';
import { useAlert } from './AlertContext';
import { WorkbookResponseMocks } from '../testUtils/workbook';

jest.mock('../contexts/ApiContext');
jest.mock('../contexts/AlertContext');
describe('WithWorkbook', () => {
  const apiMock = {
    getWorkbook: jest.fn(),
  };

  const alertMock = {
    addErrorAlert: jest.fn(),
  };
  beforeEach(() => {
    (useAlert as jest.Mock).mockImplementation(() => alertMock);
  });

  it('provides Workbook from API', async () => {
    const workbookResponse = WorkbookResponseMocks.default();
    apiMock.getWorkbook.mockResolvedValue(workbookResponse);
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = renderHookWithTheme(() => useWorkbook(), {
      wrapper: WorkbookProvider,
    });
    await waitFor(() => expect(apiMock.getWorkbook).toHaveBeenCalledWith());
    await waitFor(() =>
      expect(result.current!.getSections()).toEqual(workbookResponse.sections)
    );
  });

  it('fails to retrieve Workbook from API', async () => {
    apiMock.getWorkbook.mockRejectedValue({});
    (useApi as jest.Mock).mockImplementation(() => apiMock);

    const { result } = renderHookWithTheme(() => useWorkbook(), {
      wrapper: WorkbookProvider,
    });
    await waitFor(() => expect(apiMock.getWorkbook).toHaveBeenCalledWith());
    await waitFor(() =>
      expect(alertMock.addErrorAlert).toHaveBeenCalledWith([
        'Failed to load workbook',
      ])
    );
    await waitFor(() => expect(result.current).toBeUndefined());
  });
});
