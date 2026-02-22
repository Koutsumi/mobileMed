import { expect, Page } from '@playwright/test';

export class LayoutPage {
  constructor(private readonly page: Page) {}

  public async expectSidebarVisible() {
    await expect(this.page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Pacientes' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Exames' })).toBeVisible();
  }

  public async goToPatients() {
    await this.page.getByRole('link', { name: 'Pacientes' }).click();
  }

  public async goToExams() {
    await this.page.getByRole('link', { name: 'Exames' }).click();
  }

  public async logout() {
    await this.page.getByRole('button', { name: 'Sair' }).click();
    await expect(
      this.page.getByRole('heading', { name: 'Atenção', exact: true, level: 1 })
    ).toBeVisible();
    await this.page.getByRole('button', { name: 'Sim' }).click();
  }
}
