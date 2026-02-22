import { test, expect } from '@playwright/test';
import userSystemFixture from '../../../../fixtures/usersystem.fixture.ts';
import userSystemServices from '../../../../modules/usersystem/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('POST /user-system - Errors', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const response = await request.post(`${process.env.BASE_API_URL}/user-system`, {
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
    expect(url).toContain('/user-system');
  });

  test('Should return 400 when name is missing', async ({ request }) => {
    const payload = userSystemFixture.userSystem();

    const response = await userSystemServices.create(
      request,
      {
        name: '',
        email: payload.email,
        password: payload.password,
        status: payload.status,
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(400);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(400);
    expect(message).toEqual(['name should not be empty']);
    expect(stark).toContain('BadRequestException: Bad Request Exception');
    expect(url).toContain('/user-system');
  });

  test('Should return 500 when creating a valid user-system payload', async ({ request }) => {
    const response = await userSystemServices.create(request, userSystemFixture.userSystem(), userData?.accessToken as string);

    // TODO: Corrigir API para criar usuário com 201/409 conforme cenário. Hoje retorna 500 por erro de mapping.
    expect(response.status()).toBe(500);

    const { statusCode, message, url } = await response.json();

    expect(statusCode).toBe(500);
    expect(message).toContain('Mapping is not found for UserSystemDto and UserSystem');
    expect(url).toContain('/user-system');
  });
});
