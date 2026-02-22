import { test, expect } from '@playwright/test';
import userSystemFixture from '../../../../fixtures/usersystem.fixture.ts';
import userSystemServices from '../../../../modules/usersystem/index.ts';
import { getUserData } from '../../../../shared/helpers/getUserData.ts';
import { insertUsersystem } from '../../../../shared/helpers/db/usersystem/insertUsersystem.ts';

const userData = getUserData('./.auth/user.api.json');

// TODO: Rota não utilizada pelo sistema atualmente; manter cobertura apenas para monitorar comportamento da API.
test.describe('PUT /user-system/:id - Success', () => {
  test('Should return 500 when updating user-system', async ({ request }) => {
    const existingUser = userSystemFixture.userSystem();
    const created = await insertUsersystem(
      {
        email: existingUser.email,
        password: existingUser.password,
      },
      'PLAYWRIGHT API',
    );

    const payload = userSystemFixture.userSystem();
    const response = await userSystemServices.update(request, created.id, payload, userData?.accessToken as string);

    // TODO: Corrigir API para atualizar usuário com 200. Hoje retorna 500 por erro de mapping.
    expect(response.status()).toBe(500);

    const { statusCode, message, url } = await response.json();

    expect(statusCode).toBe(500);
    expect(message).toContain('Mapping is not found for UserSystemDto and UserSystem');
    expect(url).toContain(`/user-system/${created.id}`);
  });
});
