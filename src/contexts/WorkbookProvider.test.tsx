import { renderHookWithTheme } from '../testUtils/rendering';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApi } from '../contexts/ApiContext';
import WorkbookProvider, { useWorkbook } from './WorkbookProvider';

jest.mock('../contexts/ApiContext');
describe('WithWorkbook', () => {
  const apiMock = {
    get: jest.fn(),
  };

  it('provides Workbook', async () => {
    const sections = [
      { shortName: 'A1', title: 'A1 title' },
      { shortName: 'D1', title: 'D1 title' },
      { shortName: 'C2', title: 'C2 title' },
    ];
    const workbook = { sections: sections };
    apiMock.get.mockResolvedValue({ data: workbook });
    (useApi as jest.Mock).mockImplementation(() => apiMock);
    const { result } = renderHookWithTheme(() => useWorkbook(), {
      wrapper: WorkbookProvider,
    });
    await waitFor(() =>
      expect(apiMock.get).toHaveBeenCalledWith('v1/workbook')
    );
    await waitFor(() => expect(result.current).toEqual(workbook));
  });
});
