import { Workbook } from './Workbook';
import { WorkbookResponseMocks } from '../testUtils/workbook';
import { describe, expect, it } from 'vitest';

describe('Workbook', () => {
  it('should return found section', function () {
    const workbook = new Workbook(WorkbookResponseMocks.default());
    const sectionSearched = WorkbookResponseMocks.default().sections[0];
    expect(workbook.getSection(sectionSearched.shortName)).toEqual(
      sectionSearched
    );
  });

  it('should return true if section exists', function () {
    const workbook = new Workbook(WorkbookResponseMocks.default());
    const sectionSearched = WorkbookResponseMocks.default().sections[0];
    expect(workbook.hasSection(sectionSearched.shortName)).toBeTruthy();
  });

  it('should return all sections', function () {
    const workbook = new Workbook(WorkbookResponseMocks.default());

    expect(workbook.getSections()).toEqual(
      WorkbookResponseMocks.default().sections
    );
  });
});
