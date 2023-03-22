import { z } from 'zod';
import { CompanyFactsResponseBodySchema } from 'e-calculator-schemas/dist/company.facts.dto';

export type CompanyFacts = z.infer<typeof CompanyFactsResponseBodySchema>;
