import { renderHookWithTheme } from '../testUtils/rendering';
import { waitFor } from '@testing-library/react';

import { useApi } from './ApiProvider';
import WorkbookProvider, { useWorkbook } from './WorkbookProvider';
import { useAlert } from './AlertContext';
import { WorkbookResponseMocks } from '../testUtils/workbook';
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";

vi.mock('../contexts/ApiProvider');
vi.mock('../contexts/AlertContext');
describe('WithWorkbook', () => {
  const apiMock = {
    getWorkbook: vi.fn(),
  };

  const alertMock = {
    addErrorAlert: vi.fn(),
  };
  beforeEach(() => {
    (useAlert as Mock).mockImplementation(() => alertMock);
  });

  it('provides Workbook from API', async () => {
    const workbookResponse = WorkbookResponseMocks.default();
    apiMock.getWorkbook.mockResolvedValue(workbookResponse);
    (useApi as Mock).mockImplementation(() => apiMock);
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
    (useApi as Mock).mockImplementation(() => apiMock);

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
