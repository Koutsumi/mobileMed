import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import exameServices from '../../../../modules/exame/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertExam } from '../../../../shared/helpers/db/exam/insertExam.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

// TODO: Rota não utilizada pelo sistema atualmente; manter cobertura apenas para monitorar comportamento da API.
test.describe('PUT /exames/:id - Success', () => {
  test('Should update exam successfully', async ({ request }) => {
    const paciente = await insertPaciente();
    const insertedExam = await insertExam(paciente.id, 'PLAYWRIGHT API', 'CT');

    const payload = {
      patientId: paciente.id,
      modality: 'MR',
      idempotencyKey: uuidv4(),
      requestedAt: new Date().toISOString(),
    };

    const response = await exameServices.update(request, insertedExam.id, payload, userData?.accessToken as string);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('id', insertedExam.id);
    expect(responseBody).toHaveProperty('patientId', paciente.id);
    expect(responseBody).toHaveProperty('modality', payload.modality);
    expect(responseBody).toHaveProperty('idempotencyKey', payload.idempotencyKey);
  });
});
