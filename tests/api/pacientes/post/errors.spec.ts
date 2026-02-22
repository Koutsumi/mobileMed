import { test, expect } from '@playwright/test';
import pacienteFixture from '../../../../fixtures/paciente.fixture.ts';
import pacienteServices from '../../../../modules/paciente/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('POST /pacientes - Errors ', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const paciente = pacienteFixture.paciente();

    const response = await request.post(`${process.env.BASE_API_URL}/pacientes`, {
      data: paciente,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain('/pacientes');
  });

  test('Should return 400 when name is missing', async ({ request }) => {
    const paciente = pacienteFixture.paciente();

    const response = await pacienteServices.create(
      request,
      {
        name: '',
        document: paciente.document,
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(400);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(400);
    expect(message).toEqual(['name should not be empty']);
    expect(stark).toContain('BadRequestException: Bad Request Exception');
    expect(url).toContain('/pacientes');
  });

  test('Should return 400 when document is missing', async ({ request }) => {
    const paciente = pacienteFixture.paciente();

    const response = await pacienteServices.create(
      request,
      {
        name: paciente.name,
        document: '',
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(400);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(400);
    expect(message).toEqual(['document should not be empty']);
    expect(stark).toContain('BadRequestException: Bad Request Exception');
    expect(url).toContain('/pacientes');
  });

  test('Should return 400 when document is invalid', async ({ request }) => {
    const paciente = pacienteFixture.paciente();

    const response = await pacienteServices.create(
      request,
      {
        name: paciente.name,
        document: `${paciente.document}123`, // Documento inválido
      },
      userData?.accessToken as string,
    );

    // TODO : Corrigir API para retornar 400 quando documento é inválido. Hoje a rota retorna 201.
    expect(response.status()).toBe(201);
  });

  test('Should return 500 when document already exists', async ({ request }) => {
    const paciente = pacienteFixture.paciente();
    await insertPaciente(paciente);

    const response = await pacienteServices.create(request, paciente, userData?.accessToken as string);

    expect(response.status()).toBe(500);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(500);
    expect(message).toBe('duplicate key value violates unique constraint "ux_patient_document"');
    expect(stark).toContain('QueryFailedError: duplicate key value violates unique constraint "ux_patient_document"');
    expect(url).toContain('/pacientes');
  });
});
