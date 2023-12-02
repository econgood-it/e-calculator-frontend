import { User } from '../authentication/User';

export const exampleUser = {
  token: 'fjdlksajrklejwlqjfkljkl',
  expires: '2022-02-18T14:24:37+01:00',
  user: 3,
};

export const UserMocks = {
  default: () => ({
    access_token: 'accesstoken',
    token_type: 'Bearer',
  }),
  defaultOld: (): User => ({ ...exampleUser }),
  withId: (id: number): User => ({ ...exampleUser, user: id }),
};
