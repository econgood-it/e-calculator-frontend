import { z } from 'zod';
import { OrganizationResponseSchema } from '@ecogood/e-calculator-schemas/dist/organization.dto';

export const tmpSchema = z.object({
  address: OrganizationResponseSchema.shape.address.pick({ city: true }),
});

export type Organization = z.infer<typeof tmpSchema>;
