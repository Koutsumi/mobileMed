import { test, expect } from '@playwright/test';
import exameFixture from '../../../../fixtures/exame.fixture.ts';
import exameServices from '../../../../modules/exame/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertPaciente } from '../../../../shared/helpers/db/paciente/insertPaciente.ts';

const userData = getUserData('./.auth/user.api.json');

test.describe('POST /exames - Success', () => {
  test('Should create exam and return 201 with empty response body', async ({ request }) => {
    const paciente = await insertPaciente();
    const pacienteId = paciente.id;

    const payload = exameFixture.exam(pacienteId);

    const response = await exameServices.create(
      request,
      {
        patientId: payload.patientId,
        modality: payload.modality,
        idempotencyKey: payload.idempotencyKey,
        requestedAt: payload.requestedAt,
      },
      userData?.accessToken as string,
    );

    expect(response.status()).toBe(201);
    // TODO: Corrigir API para retornar o payload criado. Hoje a rota retorna 201 sem body.
    expect(await response.text()).toBe('');
  });
});
