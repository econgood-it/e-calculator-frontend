import { z } from 'zod';
import {
  MatrixBodySchema,
  MatrixRatingBodySchema,
} from '@ecogood/e-calculator-schemas/dist/matrix.dto';

export type Matrix = z.infer<typeof MatrixBodySchema>;
export type MatrixRating = z.infer<typeof MatrixRatingBodySchema>;
