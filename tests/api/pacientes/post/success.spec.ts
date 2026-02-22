import { test, expect } from '@playwright/test';
import pacienteFixture from '../../../../fixtures/paciente.fixture.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import pacienteServices from '../../../../modules/paciente/index.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('POST /pacientes - Success', () => {
  test('Should create a new paciente successfully', async ({ request }) => {
    const paciente = pacienteFixture.paciente();
    const response = await pacienteServices.create(request, paciente, userData?.accessToken as string);

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('name', paciente.name);
    expect(responseBody).toHaveProperty('document', paciente.document);
    expect(responseBody).toHaveProperty('createdAt');
    expect(responseBody).toHaveProperty('createdBy', userData?.userName);
    expect(responseBody).toHaveProperty('updatedAt');
    expect(responseBody).toHaveProperty('updatedBy', userData?.userName);
  });
});
