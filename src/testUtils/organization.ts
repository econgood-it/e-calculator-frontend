import { Organization } from '../models/Organization';

export const OrganizationMocks = {
  default: (): Organization => ({
    address: {
      city: 'Example City',
    },
  }),
};
