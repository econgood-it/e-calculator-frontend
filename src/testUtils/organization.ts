import _ from 'lodash';
import {
  Organization,
  OrganizationItems,
  OrganizationRequestBody,
} from '../models/Organization';

export class OrganizationMockBuilder {
  private organization: Organization = {
    id: 7,
    name: 'My organization',
    address: {
      city: 'Example City',
      street: 'Example street',
      houseNumber: '6',
      zip: '79910',
    },
  };

  public withId(id: number) {
    this.organization.id = id;
    return this;
  }

  public withName(name: string) {
    this.organization.name = name;
    return this;
  }

  public buildRequestBody(): OrganizationRequestBody {
    return _.omit(this.organization, ['id']);
  }

  public buildResponseBody() {
    return this.organization;
  }

  public build(): Organization {
    return this.organization;
  }
}

export const OrganizationItemsMocks = {
  default: (): OrganizationItems => [
    {
      id: 3,
      name: 'My Orga 3',
    },
    { id: 7, name: 'My Orga 7' },
  ],
};
