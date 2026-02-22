import { expect, test } from '@playwright/test';
import { LoginPage } from '../../../modules/auth/page/login.page.ts';
import { PatientsPage } from '../../../modules/paciente/page/patients.page.ts';
import { getUserData } from '../../../shared/helpers/getUserData.ts';

const userData = getUserData('./.auth/user.ui.json');

if (!userData) {
  throw new Error('No UI user session found in .auth/user.ui.json');
}

test.describe('E2E /login - Authentication', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
  });

  test('Should validate login page marker text', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.expectLoaded();
  });

  test('Should show required fields errors when submitting empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.submitWithoutCredentials();

    await loginPage.expectSnackbarMessage('Preencha todos os campos obrigatórios.');
    await loginPage.expectRequiredFieldsError();
  });

  test('Should show invalid credentials message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(userData.userEmail, 'invalid-password');

    await loginPage.expectSnackbarMessage('Usuário ou senha inválidos, verifique suas credenciais.');
    await loginPage.expectInvalidPasswordError();
  });

  test('Should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const patientsPage = new PatientsPage(page);

    await loginPage.login(userData.userEmail, 'test@123');

    await expect(page).toHaveURL(/\/patients$/);
    await patientsPage.expectLoaded();
  });
});
