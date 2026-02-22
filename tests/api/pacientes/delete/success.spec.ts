import { test, expect } from '@playwright/test';
import pacienteServices from '../../../../modules/paciente/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('DELETE /pacientes/:id - Success', () => {
  test('Should delete paciente successfully', async ({ request }) => {
    const created = await insertPaciente();

    const response = await pacienteServices.delete(request, created.id, userData?.accessToken as string);

    expect(response.status()).toBe(204);
  });
});
