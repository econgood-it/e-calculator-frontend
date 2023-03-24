import { IndustryResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/industry.dto';
import { z } from 'zod';

export type Industry = z.infer<typeof IndustryResponseBodySchema>;
