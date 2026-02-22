import { test, expect } from '@playwright/test';
import pacienteFixture from '../../../../fixtures/paciente.fixture.ts';
import pacienteServices from '../../../../modules/paciente/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('PUT /pacientes/:id - Errors', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const created = await insertPaciente();

    const response = await request.put(`${process.env.BASE_API_URL}/pacientes/${created.id}`, {
      data: pacienteFixture.paciente(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain(`/pacientes/${created.id}`);
  });

  test('Should return 400 when name is missing', async ({ request }) => {
    const created = await insertPaciente();

    const payload = pacienteFixture.paciente();
    const response = await pacienteServices.update(
      request,
      created.id,
      {
        name: '',
        document: payload.document,
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(400);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(400);
    expect(message).toEqual(['name should not be empty']);
    expect(stark).toContain('BadRequestException: Bad Request Exception');
    expect(url).toContain(`/pacientes/${created.id}`);
  });
});
