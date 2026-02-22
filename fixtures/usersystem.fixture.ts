import { fakerPT_BR as faker } from '@faker-js/faker';
import { IUserSystemRequest } from '../modules/usersystem/repository/usersystem.types.ts';
import { v4 as uuidv4 } from 'uuid';

export default {
  userSystem: function (): IUserSystemRequest {
    const data: IUserSystemRequest = {
      name: faker.person.fullName(),
      email: `usersystem_${uuidv4()}@mobilemed.com`,
      password: 'test@123',
      status: 1,
    };

    return data;
  },
};
