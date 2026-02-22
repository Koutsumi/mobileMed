import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import userSystemServices from '../../../../modules/usersystem/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('DELETE /user-system/:id - Errors', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const userSystemId = randomUUID();
    const response = await request.delete(`${process.env.BASE_API_URL}/user-system/${userSystemId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain(`/user-system/${userSystemId}`);
  });

  test('Should return 204 when deleting non-registered user-system id', async ({ request }) => {
    const userSystemId = randomUUID();
    const response = await userSystemServices.delete(request, userSystemId, userData?.accessToken as string);

    // TODO: Corrigir API para retornar 404 quando user-system não existe. Hoje retorna 204.
    expect(response.status()).toBe(204);
  });
});
