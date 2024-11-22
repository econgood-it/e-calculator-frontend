import { makeWorkbook } from './Workbook';
import { WorkbookResponseMocks } from '../testUtils/workbook';
import { describe, expect, it } from 'vitest';

describe('Workbook', () => {
  it('should return found group', function () {
    const workbook = makeWorkbook(WorkbookResponseMocks.default());
    expect(workbook.findGroup('B')).toEqual({
      shortName: 'B',
      name: 'Eigentümer*innen und Finanzpartner*innen',
    });
  });
});
