import { expect, Locator, Page } from '@playwright/test';

export class ManagePatientDialogPage {
  public readonly nameInput: Locator;
  public readonly documentInput: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.locator('input[formcontrolname="name"]');
    this.documentInput = page.locator('input[formcontrolname="document"]');
  }

  public async expectNewDialogOpened() {
    await expect(
      this.page.getByRole('heading', { name: 'Novo paciente', exact: true, level: 2 })
    ).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.documentInput).toBeVisible();
  }

  public async expectEditDialogOpened() {
    await expect(
      this.page.getByRole('heading', { name: 'Editar paciente', exact: true, level: 2 })
    ).toBeVisible();
  }

  public async fillPatient(name: string, document: string) {
    await this.nameInput.fill(name);
    await this.documentInput.fill(document);
  }

  public async submit() {
    await this.page.getByRole('button', { name: 'Salvar' }).click();
  }

  public async expectRequiredFieldsError(count: number = 2) {
    await expect(this.page.getByText('- Campo obrigatório')).toHaveCount(count);
  }

  public async expectInvalidDocumentError() {
    await expect(this.page.getByText('- Documento inválido')).toBeVisible();
  }

  public async expectSnackbarMessage(message: string) {
    const snackBar = this.page.locator('mat-snack-bar-container');

    await expect(snackBar).toContainText(message);
  }
}
