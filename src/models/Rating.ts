import { RatingResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/rating.dto';
import { z } from 'zod';

export enum StakholderShortNames {
  Suppliers = 'A',
  Finance = 'B',
  Employees = 'C',
  Customers = 'D',
  Society = 'E',
}

export type Rating = z.infer<typeof RatingResponseBodySchema>;
