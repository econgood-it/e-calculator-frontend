import { WorkbookResponse } from '../models/Workbook';

export const WorkbookResponseMocks = {
  default: (): WorkbookResponse => ({
    sections: [
      { shortName: 'A1.1', title: 'A1.1 title' },
      { shortName: 'D1.1', title: 'D1.1 title' },
      { shortName: 'B1.1', title: 'B1.1 title' },
    ],
  }),
};
