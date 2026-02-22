import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import exameServices from '../../../../modules/exame/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('GET /exames - Errors', () => {
  test('Should return 401 when no token is provided in list request', async ({ request }) => {
    const response = await request.get(`${process.env.BASE_API_URL}/exames`);

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain('/exames');
  });

  test('Should return 500 when exam does not exist due to known API error', async ({ request }) => {
    const examId = randomUUID();
    const response = await exameServices.findOne(request, examId, userData?.accessToken as string);

    // TODO: Corrigir API para retornar 404 quando exame não existe (hoje retorna 500).
    expect(response.status()).toBe(500);

    const { statusCode, message, url } = await response.json();

    expect(statusCode).toBe(500);
    expect(message).toContain('syntax error at or near');
    expect(url).toContain(`/exames/${examId}`);
  });
});
