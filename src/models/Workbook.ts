import { WorkbookResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/workbook.dto';
import { z } from 'zod';

export type Workbook = z.infer<typeof WorkbookResponseBodySchema>;
