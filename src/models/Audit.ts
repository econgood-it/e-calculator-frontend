import { z } from 'zod';
import {
  AuditSubmitRequestBodySchema,
  AuditSubmitResponseBodySchema,
} from '@ecogood/e-calculator-schemas/dist/audit.dto';

export type Audit = z.infer<typeof AuditSubmitResponseBodySchema>;
export type AuditSubmitRequestBody = z.input<
  typeof AuditSubmitRequestBodySchema
>;
