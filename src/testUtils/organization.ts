import { Organization, OrganizationItems } from '../models/Organization';

export const OrganizationMocks = {
  default: (): Organization => ({
    id: 7,
    address: {
      city: 'Example City',
    },
  }),
};

export const OrganizationItemsMocks = {
  default: (): OrganizationItems => [
    {
      id: 3,
    },
    { id: 7 },
  ],
};
