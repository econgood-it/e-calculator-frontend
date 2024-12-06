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
    evaluationLevels: [
      {
        level: 0,
        name: 'Vorbildlich',
        pointsFrom: 7,
        pointsTo: 10,
      },
      {
        level: 1,
        name: 'Erfahren',
        pointsFrom: 4,
        pointsTo: 6,
      },
      { level: 2, name: 'Fortgeschritten', pointsFrom: 2, pointsTo: 3 },
      {
        level: 3,
        name: 'Erste Schritte',
        pointsFrom: 1,
        pointsTo: 1,
      },
      { level: 4, name: 'Basislinie', pointsFrom: 0, pointsTo: 0 },
    ],
  }),
};
