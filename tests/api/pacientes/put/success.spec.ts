import { test, expect } from '@playwright/test';
import pacienteFixture from '../../../../fixtures/paciente.fixture.ts';
import pacienteServices from '../../../../modules/paciente/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('PUT /pacientes/:id - Success', () => {
  test('Should update paciente successfully', async ({ request }) => {
    const created = await insertPaciente();

    const payload = pacienteFixture.paciente();
    const response = await pacienteServices.update(request, created.id, payload, userData?.accessToken as string);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('id', created.id);
    expect(responseBody).toHaveProperty('name', payload.name);
    expect(responseBody).toHaveProperty('document', payload.document);
  });
});
