import { expect, Locator, Page } from '@playwright/test';

export class ExamsPage {
  constructor(private readonly page: Page) {}

  public async goto() {
    await this.page.goto('/exams');
    await this.expectLoaded();
  }

  public async expectLoaded() {
    await expect(
      this.page.getByRole('heading', { name: 'Exames', exact: true, level: 1 })
    ).toBeVisible();
    await expect(this.page.getByText('Registre e visualize exames de pacientes')).toBeVisible();
  }

  public getRowByPatientName(name: string): Locator {
    const patientCell = this.page.getByRole('cell', { name: name.toUpperCase() }).first();

    return patientCell.locator('xpath=ancestor::tr[1]').first();
  }

  public async expectExamInTable(patientName: string, modality: string) {
    const row = this.getRowByPatientName(patientName);

    await expect(row).toBeVisible();
    await expect(row).toContainText(modality);
  }

  public async deleteExamByPatientName(patientName: string) {
    const row = this.getRowByPatientName(patientName);
    const deleteButton = row.locator('button').first();

    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    await expect(
      this.page.getByRole('heading', { name: 'Confirmação de exclusão', exact: true, level: 1 })
    ).toBeVisible();
    await expect(this.page.locator('mat-dialog-content p')).toContainText(
      `Você tem certeza que deseja remover esse exame do paciente ${patientName}?`
    );
    await this.page.getByRole('button', { name: 'Confirmar' }).click();
  }

  public async expectSnackbarMessage(message: string) {
    const snackBar = this.page.locator('mat-snack-bar-container');

    await expect(snackBar).toContainText(message);
  }
}
