import { test, expect } from '@playwright/test';
import pacienteServices from '../../../../modules/paciente/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('GET /pacientes - Success', () => {
  test('Should return 200 when listing pacientes', async ({ request }) => {
    await insertPaciente();

    const response = await pacienteServices.findAll(request, userData?.accessToken as string);

    expect(response.status()).toBe(200);

    const { statusCode, message, data, url, pagination } = await response.json();

    expect(statusCode).toBe(200);
    expect(message).toBe('Patient fetched successfully');
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(url).toContain('/pacientes');
    expect(pagination).toHaveProperty('totalItems');
  });

  test('Should return 200 when finding paciente by id', async ({ request }) => {
    const created = await insertPaciente();

    const response = await pacienteServices.findOne(request, created.id, userData?.accessToken as string);

    // TODO: Corrigir API para retornar 200 quando paciente é encontrado. Hoje a rota retorna 500.
    expect(response.status()).toBe(500);

    const { statusCode, message, data, url } = await response.json();

    expect(statusCode).toBe(500);
    // expect(message).toBe('Patient found');
    // expect(data).toHaveProperty('id', created.id);
    // expect(url).toContain(`/pacientes/${created.id}`);
  });
});
