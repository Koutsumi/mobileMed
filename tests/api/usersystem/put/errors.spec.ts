import { test, expect } from '@playwright/test';
import userSystemFixture from '../../../../fixtures/usersystem.fixture.ts';
import userSystemServices from '../../../../modules/usersystem/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertUsersystem } from '../../../../shared/helpers/db/usersystem/insertUsersystem.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('PUT /user-system/:id - Errors', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const seededUser = userSystemFixture.userSystem();
    const created = await insertUsersystem(
      {
        email: seededUser.email,
        password: seededUser.password,
      },
      'PLAYWRIGHT API',
    );

    const response = await request.put(`${process.env.BASE_API_URL}/user-system/${created.id}`, {
      data: userSystemFixture.userSystem(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain(`/user-system/${created.id}`);
  });

  test('Should return 400 when email is missing', async ({ request }) => {
    const seededUser = userSystemFixture.userSystem();
    const created = await insertUsersystem(
      {
        email: seededUser.email,
        password: seededUser.password,
      },
      'PLAYWRIGHT API',
    );

    const payload = userSystemFixture.userSystem();
    const response = await userSystemServices.update(
      request,
      created.id,
      {
        name: payload.name,
        email: '',
        password: payload.password,
        status: payload.status,
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(400);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(400);
    expect(message).toEqual(['email should not be empty']);
    expect(stark).toContain('BadRequestException: Bad Request Exception');
    expect(url).toContain(`/user-system/${created.id}`);
  });
});
