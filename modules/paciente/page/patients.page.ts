import { expect, Locator, Page } from '@playwright/test';

export class PatientsPage {
  constructor(private readonly page: Page) {}

  public async goto() {
    await this.page.goto('/patients');
    await this.expectLoaded();
  }

  public async expectLoaded() {
    await expect(
      this.page.getByRole('heading', { name: 'Pacientes', exact: true, level: 1 })
    ).toBeVisible();
    await expect(this.page.getByText('Registre e visualize pacientes')).toBeVisible();
  }

  public async openNewPatientDialog() {
    await this.page.getByRole('button', { name: 'Novo Paciente' }).click();
  }

  public getRowByPatientDocument(document: string): Locator {
    const documentCell = this.getPatientDocumentCell(document);

    return documentCell.locator('xpath=ancestor::tr[1]').first();
  }

  public async searchPatientByDocument(document: string): Promise<boolean> {
    const firstPageButton = this.page.locator('button.mat-mdc-paginator-navigation-first');
    const nextPageButton = this.page.locator('button.mat-mdc-paginator-navigation-next');
    const maxReloadAttempts = 3;

    for (let attempt = 0; attempt < maxReloadAttempts; attempt++) {
      const isFirstPageEnabled = await firstPageButton.isEnabled();
      if (isFirstPageEnabled) {
        await firstPageButton.click();
        await this.page.waitForTimeout(250);
      }

      const totalPages = await this.getTotalPagesCount();

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const patientDocumentCell = this.getPatientDocumentCell(document);
        const hasPatientInCurrentPage = (await patientDocumentCell.count()) > 0;

        if (hasPatientInCurrentPage) {
          return true;
        }

        const isLastPage = pageIndex === totalPages - 1;
        if (isLastPage) {
          break;
        }

        await nextPageButton.click();
        await this.page.waitForTimeout(250);
      }

      const isLastAttempt = attempt === maxReloadAttempts - 1;
      if (isLastAttempt) {
        break;
      }

      await this.page.reload();
      await this.expectLoaded();
    }

    return false;
  }

  private getPaginatorRangeLabel(): Locator {
    return this.page.locator('mat-paginator .mat-mdc-paginator-range-label').first();
  }

  private async getPaginatorRangeText(): Promise<string> {
    const rangeLabel = this.getPaginatorRangeLabel();

    await expect(rangeLabel).toBeVisible();
    return (await rangeLabel.innerText()).trim();
  }

  private async getTotalPagesCount(): Promise<number> {
    const rangeText = await this.getPaginatorRangeText();
    const totalItemsMatch = rangeText.match(/of\s+(\d+)/i);

    if (!totalItemsMatch) {
      return 1;
    }

    const totalItems = Number(totalItemsMatch[1]);
    if (!totalItems) {
      return 1;
    }

    const pageSizeSelect = this.page.getByRole('combobox', { name: 'Items per page:' });
    await expect(pageSizeSelect).toBeVisible();

    const pageSizeText = (await pageSizeSelect.innerText()).trim();
    const pageSizeMatch = pageSizeText.match(/\d+/);
    const pageSize = pageSizeMatch ? Number(pageSizeMatch[0]) : 25;

    return Math.max(1, Math.ceil(totalItems / pageSize));
  }

  private getPatientDocumentCell(document: string): Locator {
    const normalizedDocument = document.replace(/\D/g, '');
    const exactDocumentPattern = new RegExp(`^\\s*${normalizedDocument}\\s*$`);

    return this.page.locator('td.mat-mdc-cell').filter({ hasText: exactDocumentPattern }).first();
  }

  public async getFirstPatientRowText(): Promise<string> {
    const firstRow = this.page.locator('tr.mat-mdc-row').first();

    await expect(firstRow).toBeVisible();
    return (await firstRow.innerText()).trim();
  }

  public async goToNextPage() {
    const nextPageButton = this.page.locator('button.mat-mdc-paginator-navigation-next');

    await expect(nextPageButton).toBeEnabled();
    await nextPageButton.click();
  }

  public async openNewExamDialogByPatientDocument(document: string) {
    const foundPatient = await this.searchPatientByDocument(document);

    expect(foundPatient).toBeTruthy();

    const documentCell = this.getPatientDocumentCell(document);
    const documentCellText = await documentCell.innerText();
    const expectedDigits = document.replace(/\D/g, '');
    const foundDigits = documentCellText.replace(/\D/g, '');

    expect(foundDigits).toBe(expectedDigits);

    const row = this.getRowByPatientDocument(document);
    const addExamButton = row.locator('button').nth(0);

    await expect(addExamButton).toBeVisible();
    await addExamButton.click();
  }

  public async openEditPatientDialogByDocument(document: string) {
    const foundPatient = await this.searchPatientByDocument(document);

    expect(foundPatient).toBeTruthy();

    const row = this.getRowByPatientDocument(document);
    const editButton = row.locator('button').nth(1);

    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  public async deletePatientByDocument(document: string) {
    const foundPatient = await this.searchPatientByDocument(document);

    expect(foundPatient).toBeTruthy();

    const row = this.getRowByPatientDocument(document);
    const deleteButton = row.locator('button').nth(2);

    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    await expect(
      this.page.getByRole('heading', { name: 'Confirmação de exclusão', exact: true, level: 1 })
    ).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirmar' }).click();
  }

  public async expectPatientInTableByDocument(document: string) {
    const foundPatient = await this.searchPatientByDocument(document);

    expect(foundPatient).toBeTruthy();
    await expect(this.getRowByPatientDocument(document)).toBeVisible();
  }

  public async expectSnackbarMessage(message: string) {
    const snackBar = this.page.locator('mat-snack-bar-container');

    await expect(snackBar).toContainText(message);
  }
}
