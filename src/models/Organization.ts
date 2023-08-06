import { z } from 'zod';
import {
  OrganizationItemsResponseSchema,
  OrganizationResponseSchema,
} from '@ecogood/e-calculator-schemas/dist/organization.dto';

export const tmpSchema = z.object({
  id: OrganizationResponseSchema.shape.id,
  address: OrganizationResponseSchema.shape.address.pick({ city: true }),
});

export const tmpRequestSchema = z.object({
  address: OrganizationResponseSchema.shape.address.pick({ city: true }),
});

export type OrganizationRequestBody = z.infer<typeof tmpRequestSchema>;

export type Organization = z.infer<typeof tmpSchema>;

export type OrganizationItems = z.infer<typeof OrganizationItemsResponseSchema>;
