import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.locator('input[formcontrolname="email"]');
    this.passwordInput = page.locator('input[formcontrolname="password"]');
    this.submitButton = page.getByRole('button', { name: 'Acessar' });
  }

  public async goto() {
    await this.page.goto('/login');
    await this.expectLoaded();
  }

  public async expectLoaded() {
    await expect(
      this.page.getByRole('heading', { name: 'Valide seu acesso!', exact: true, level: 2 })
    ).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  public async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  public async submitWithoutCredentials() {
    await this.submitButton.click();
  }

  public async expectSnackbarMessage(message: string) {
    const snackBar = this.page.locator('mat-snack-bar-container');

    await expect(snackBar).toContainText(message);
  }

  public async expectRequiredFieldsError() {
    await expect(this.page.getByText('- Campo obrigatório')).toHaveCount(2);
  }

  public async expectInvalidPasswordError() {
    await expect(this.page.getByText('- Senha inválida')).toBeVisible();
  }
}
