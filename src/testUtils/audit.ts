import { Factory } from 'fishery';
import { Audit } from '../models/Audit.ts';
import { CertificationAuthorityNames } from '@ecogood/e-calculator-schemas/dist/audit.dto';

export const auditFactory = Factory.define<Audit>(() => ({
  id: 8,
  submittedAt: new Date().toISOString(),
  certificationAuthority: CertificationAuthorityNames.AUDIT,
}));
