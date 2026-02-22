import { test, expect } from '@playwright/test';
import exameServices from '../../../../modules/exame/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertExam } from '../../../../shared/helpers/db/exam/insertExam.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

// TODO: Rota não utilizada pelo sistema atualmente; manter cobertura apenas para monitorar comportamento da API.
test.describe('PUT /exames/:id - Errors', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const paciente = await insertPaciente();
    const insertedExam = await insertExam(paciente.id, 'PLAYWRIGHT API', 'CT');

    const response = await request.put(`${process.env.BASE_API_URL}/exames/${insertedExam.id}`, {
      data: {
        patientId: paciente.id,
        modality: 'MR',
        idempotencyKey: 'any-value',
        requestedAt: new Date().toISOString(),
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain(`/exames/${insertedExam.id}`);
  });

  test('Should return 400 when idempotencyKey is missing', async ({ request }) => {
    const paciente = await insertPaciente();
    const insertedExam = await insertExam(paciente.id, 'PLAYWRIGHT API', 'CT');

    const response = await exameServices.update(
      request,
      insertedExam.id,
      {
        patientId: paciente.id,
        modality: 'MR',
        idempotencyKey: '',
        requestedAt: new Date().toISOString(),
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(400);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(400);
    expect(message).toEqual(['idempotencyKey should not be empty']);
    expect(stark).toContain('BadRequestException: Bad Request Exception');
    expect(url).toContain(`/exames/${insertedExam.id}`);
  });
});
