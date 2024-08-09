import { z } from 'zod';
import {
  CompanyFactsPatchRequestBodySchema,
  CompanyFactsResponseBodySchema,
} from '@ecogood/e-calculator-schemas/dist/company.facts.dto';

export type CompanyFacts = z.infer<typeof CompanyFactsResponseBodySchema>;
export type CompanyFactsPatchRequestBody = z.infer<
  typeof CompanyFactsPatchRequestBodySchema
>;
