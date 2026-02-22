import { test, expect } from '@playwright/test';
import userSystemFixture from '../../../../fixtures/usersystem.fixture.ts';
import userSystemServices from '../../../../modules/usersystem/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';

const userData = getUserData('./.auth/user.api.json');

// TODO: Rota não utilizada pelo sistema atualmente; manter cobertura apenas para monitorar comportamento da API.
test.describe('POST /user-system - Success', () => {
  test('Should return 500 when creating user-system', async ({ request }) => {
    const payload = userSystemFixture.userSystem();
    const response = await userSystemServices.create(request, payload, userData?.accessToken as string);

    // TODO: Corrigir API para criar usuário com 201. Hoje retorna 500 por erro de mapping.
    expect(response.status()).toBe(500);

    const { statusCode, message, url } = await response.json();

    expect(statusCode).toBe(500);
    expect(message).toContain('Mapping is not found for UserSystemDto and UserSystem');
    expect(url).toContain('/user-system');
  });
});
