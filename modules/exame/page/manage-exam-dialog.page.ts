import { expect, Locator, Page } from '@playwright/test';

export class ManageExamDialogPage {
  public readonly modalitySelect: Locator;

  constructor(private readonly page: Page) {
    this.modalitySelect = page.locator('mat-select[formcontrolname="modality"]');
  }

  public async expectNewDialogOpened() {
    await expect(
      this.page.getByRole('heading', { name: 'Novo exame', exact: true, level: 2 })
    ).toBeVisible();
    await expect(this.modalitySelect).toBeVisible();
  }

  public async chooseModality(modality: string) {
    await this.modalitySelect.click();
    await this.page.getByRole('option', { name: modality, exact: true }).click();
  }

  public async submit() {
    await this.page.getByRole('button', { name: 'Salvar' }).click();
  }

  public async expectRequiredFieldError() {
    await expect(this.page.getByText('Campo obrigatório')).toBeVisible();
  }

  public async expectSnackbarMessage(message: string, type: 'success' | 'error' = 'success') {
    const snackBar = this.page.locator(`mat-snack-bar-container.custom-${type}-snackbar`).last();

    await expect(snackBar).toBeVisible();
    await expect(snackBar).toContainText(message);
  }
}
