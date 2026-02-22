import { test, expect } from '@playwright/test';
import userSystemFixture from '../../../../fixtures/usersystem.fixture.ts';
import userSystemServices from '../../../../modules/usersystem/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertUsersystem } from '../../../../shared/helpers/db/usersystem/insertUsersystem.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('GET /user-system - Success', () => {
  test('Should return 200 when listing user-system', async ({ request }) => {
    const seededUser = userSystemFixture.userSystem();
    await insertUsersystem(
      {
        email: seededUser.email,
        password: seededUser.password,
      },
      'PLAYWRIGHT API',
    );

    const response = await userSystemServices.findAll(request, userData?.accessToken as string);

    expect(response.status()).toBe(200);

    const { statusCode, message, data, url, pagination } = await response.json();

    expect(statusCode).toBe(200);
    expect(message).toBe('UserSystem fetched successfully');
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(url).toContain('/user-system');
    expect(pagination).toHaveProperty('totalItems');
  });

  test('Should return 200 when listing user-system paginated', async ({ request }) => {
    const seededUser = userSystemFixture.userSystem();
    await insertUsersystem(
      {
        email: seededUser.email,
        password: seededUser.password,
      },
      'PLAYWRIGHT API',
    );

    const response = await userSystemServices.findAllPaginated(request, userData?.accessToken as string);

    expect(response.status()).toBe(200);

    const { statusCode, message, data, url, pagination } = await response.json();

    expect(statusCode).toBe(200);
    expect(message).toBe('UsersSystem fetched successfully');
    expect(Array.isArray(data)).toBeTruthy();
    expect(url).toContain('/user-system/paginated');
    expect(pagination).toHaveProperty('currentPage');
  });

  test('Should return 200 when finding user-system by id', async ({ request }) => {
    const seededUser = userSystemFixture.userSystem();
    const created = await insertUsersystem(
      {
        email: seededUser.email,
        password: seededUser.password,
      },
      'PLAYWRIGHT API',
    );

    const response = await userSystemServices.findOne(request, created.id, userData?.accessToken as string);

    expect(response.status()).toBe(200);

    const { statusCode, message, data, url } = await response.json();

    expect(statusCode).toBe(200);
    expect(message).toBe('UserSystem found');
    expect(data).toHaveProperty('id', created.id);
    expect(url).toContain(`/user-system/${created.id}`);
  });
});
