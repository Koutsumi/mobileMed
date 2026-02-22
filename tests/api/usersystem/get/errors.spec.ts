import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import userSystemServices from '../../../../modules/usersystem/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('GET /user-system - Errors', () => {
  test('Should return 401 when no token is provided in list request', async ({ request }) => {
    const response = await request.get(`${process.env.BASE_API_URL}/user-system`);

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain('/user-system');
  });

  test('Should return 404 when user-system does not exist', async ({ request }) => {
    const userSystemId = randomUUID();
    const response = await userSystemServices.findOne(request, userSystemId, userData?.accessToken as string);

    expect(response.status()).toBe(404);

    const { statusCode, message, data, url } = await response.json();

    expect(statusCode).toBe(404);
    expect(message).toBe('UserSystem not found');
    expect(data).toBeNull();
    expect(url).toContain(`/user-system/${userSystemId}`);
  });
});
