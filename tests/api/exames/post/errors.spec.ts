import { test, expect } from '@playwright/test';
import exameFixture from '../../../../fixtures/exame.fixture.ts';
import exameServices from '../../../../modules/exame/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('POST /exames - Errors', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const response = await request.post(`${process.env.BASE_API_URL}/exames`, {
      data: exameFixture.exam('00000000-0000-0000-0000-000000000000'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain('/exames');
  });

  test('Should return 400 when patientId is missing', async ({ request }) => {
    const response = await exameServices.create(
      request,
      {
        patientId: '',
        modality: 'CT',
        idempotencyKey: `key-${Date.now()}`,
        requestedAt: new Date().toISOString(),
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(400);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(400);
    expect(message).toEqual(['patientId should not be empty']);
    expect(stark).toContain('BadRequestException: Bad Request Exception');
    expect(url).toContain('/exames');
  });

  test('Should return 400 when modality is invalid', async ({ request }) => {
    const paciente = await insertPaciente();
    const payload = exameFixture.exam(paciente.id);

    const response = await exameServices.create(
      request,
      {
        patientId: paciente.id,
        modality: 'INVALID_MODALITY',
        idempotencyKey: payload.idempotencyKey,
        requestedAt: payload.requestedAt,
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(400);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(400);
    expect(message[0]).toContain('modality must be one of the following values');
    expect(stark).toContain('BadRequestException: Bad Request Exception');
    expect(url).toContain('/exames');
  });
});
