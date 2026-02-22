import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import pacienteServices from '../../../../modules/paciente/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('GET /pacientes - Errors', () => {
  test('Should return 401 when no token is provided in list request', async ({ request }) => {
    const response = await request.get(`${process.env.BASE_API_URL}/pacientes`);

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain('/pacientes');
  });

  test('Should return 500 when paciente does not exist due to known API error', async ({ request }) => {
    const pacienteId = randomUUID();
    const response = await pacienteServices.findOne(request, pacienteId, userData?.accessToken as string);

    // TODO: Corrigir API para retornar 404 quando paciente não existe (hoje retorna 500).
    expect(response.status()).toBe(500);

    const { statusCode, message, url } = await response.json();

    expect(statusCode).toBe(500);
    expect(message).toContain('syntax error at or near');
    expect(url).toContain(`/pacientes/${pacienteId}`);
  });
});
