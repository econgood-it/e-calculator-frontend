import { z } from 'zod';
import {
  OrganizationItemsResponseSchema,
  OrganizationResponseSchema,
} from '@ecogood/e-calculator-schemas/dist/organization.dto';

export const tmpSchema = z.object({
  address: OrganizationResponseSchema.shape.address.pick({ city: true }),
});

export type Organization = z.infer<typeof tmpSchema>;

export type OrganizationItems = z.infer<typeof OrganizationItemsResponseSchema>;
