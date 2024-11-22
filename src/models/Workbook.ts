import { WorkbookResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/workbook.dto';
import { z } from 'zod';
import deepFreeze from 'deep-freeze';
export type WorkbookResponse = z.infer<typeof WorkbookResponseBodySchema>;

export type Workbook = {
  findGroup: (
    shortName: string
  ) => { shortName: string; name: string } | undefined;
};

export function makeWorkbook(data: WorkbookResponse): Workbook {
  function findGroup(shortName: string) {
    return data.groups.find((g) => g.shortName === shortName);
  }
  return deepFreeze({
    findGroup,
  });
}
