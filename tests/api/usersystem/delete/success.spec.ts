import { test, expect } from '@playwright/test';
import userSystemFixture from '../../../../fixtures/usersystem.fixture.ts';
import userSystemServices from '../../../../modules/usersystem/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertUsersystem } from '../../../../shared/helpers/db/usersystem/insertUsersystem.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('DELETE /user-system/:id - Success', () => {
  test('Should delete user-system successfully', async ({ request }) => {
    const seededUser = userSystemFixture.userSystem();
    const created = await insertUsersystem(
      {
        email: seededUser.email,
        password: seededUser.password,
      },
      'PLAYWRIGHT API',
    );

    const response = await userSystemServices.delete(request, created.id, userData?.accessToken as string);

    expect(response.status()).toBe(204);
  });
});
