import { test, expect } from '@playwright/test';
import exameServices from '../../../../modules/exame/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertExam } from '../../../../shared/helpers/db/exam/insertExam.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('DELETE /exames/:id - Success', () => {
  test('Should delete exam successfully', async ({ request }) => {
    const paciente = await insertPaciente();
    const insertedExam = await insertExam(paciente.id, 'PLAYWRIGHT API', 'CT');

    const response = await exameServices.delete(request, insertedExam.id, userData?.accessToken as string);

    expect(response.status()).toBe(204);
  });
});
