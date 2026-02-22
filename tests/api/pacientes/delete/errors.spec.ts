import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import pacienteServices from '../../../../modules/paciente/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('DELETE /pacientes/:id - Errors', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const pacienteId = randomUUID();
    const response = await request.delete(`${process.env.BASE_API_URL}/pacientes/${pacienteId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain(`/pacientes/${pacienteId}`);
  });

  test('Should return 204 when deleting non-registered paciente id', async ({ request }) => {
    const pacienteId = randomUUID();
    const response = await pacienteServices.delete(request, pacienteId, userData?.accessToken as string);

    // TODO: Corrigir API para retornar 404 quando paciente não existe. Hoje retorna 204.
    expect(response.status()).toBe(204);
  });
});
