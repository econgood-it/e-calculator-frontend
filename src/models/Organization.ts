import { z } from 'zod';
import {
  OrganizationItemsResponseSchema,
  OrganizationRequestSchema,
  OrganizationResponseSchema,
  OrganizationItemResponseSchema,
} from '@ecogood/e-calculator-schemas/dist/organization.dto';

export type OrganizationRequestBody = z.infer<typeof OrganizationRequestSchema>;

export type Organization = z.infer<typeof OrganizationResponseSchema>;

export type OrganizationItems = z.infer<typeof OrganizationItemsResponseSchema>;

export type OrganizationItem = z.infer<typeof OrganizationItemResponseSchema>;
