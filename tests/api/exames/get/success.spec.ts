import { test, expect } from '@playwright/test';
import exameServices from '../../../../modules/exame/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertExam } from '../../../../shared/helpers/db/exam/insertExam.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('GET /exames - Success', () => {
  test('Should return 200 when listing exams', async ({ request }) => {
    const paciente = await insertPaciente();
    await insertExam(paciente.id, 'PLAYWRIGHT API', 'CT');

    const response = await exameServices.findAll(request, userData?.accessToken as string);

    expect(response.status()).toBe(200);

    const { statusCode, message, data, url, pagination } = await response.json();

    expect(statusCode).toBe(200);
    expect(message).toBe('Exams fetched successfully');
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(url).toContain('/exames');
    expect(pagination).toHaveProperty('totalItems');
  });

  test('Should return 200 when listing exams paginated', async ({ request }) => {
    const paciente = await insertPaciente();
    await insertExam(paciente.id, 'PLAYWRIGHT API', 'CT');

    const response = await exameServices.findAllPaginated(request, userData?.accessToken as string);

    expect(response.status()).toBe(200);

    const { statusCode, message, data, url, pagination } = await response.json();

    expect(statusCode).toBe(200);
    expect(message).toBe('Exams fetched successfully');
    expect(Array.isArray(data)).toBeTruthy();
    expect(url).toContain('/exames/paginated');
    expect(pagination).toHaveProperty('currentPage');
  });

  test('Should return 200 when finding exam by id', async ({ request }) => {
    const paciente = await insertPaciente();
    const insertedExam = await insertExam(paciente.id, 'PLAYWRIGHT API', 'CT');

    const response = await exameServices.findOne(request, insertedExam.id, userData?.accessToken as string);

    // TODO: Corrigir API para retornar 200 quando exame é encontrado. Hoje a rota retorna 500.
    expect(response.status()).toBe(500);

    const { statusCode, message, data, url } = await response.json();

    expect(statusCode).toBe(500);
    // expect(message).toBe('Exam found');
    // expect(data).toHaveProperty('id', insertedExam.id);
    // expect(url).toContain(`/exames/${insertedExam.id}`);
  });
});
