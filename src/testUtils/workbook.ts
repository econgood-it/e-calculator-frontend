import { WorkbookResponse } from '../models/Workbook';
import {
  BalanceSheetType,
  BalanceSheetVersion,
} from '@ecogood/e-calculator-schemas/dist/shared.schemas';

export const WorkbookResponseMocks = {
  default: (): WorkbookResponse => ({
    version: BalanceSheetVersion.v5_1_0,
    type: BalanceSheetType.Full,
    groups: [
      { shortName: 'A', name: 'Lieferant*innen' },
      {
        shortName: 'B',
        name: 'Eigentümer*innen und Finanzpartner*innen',
      },
      { shortName: 'C', name: 'Mitarbeitende' },
      { shortName: 'D', name: 'Kund*innen und Mitunternehmen' },
      { shortName: 'E', name: 'Gesellschaftliches Umfeld' },
    ],
  }),
};
