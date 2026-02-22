import { expect, test } from '@playwright/test';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { ManagePatientDialogPage } from '../../../modules/paciente/page/manage-patient-dialog.page.ts';
import { PatientsPage } from '../../../modules/paciente/page/patients.page.ts';
import pacienteServices from '../../../modules/paciente/index.ts';
import { generateCPF } from '../../../shared/generateCpf.ts';
import { getUserData } from '../../../shared/helpers/getUserData.ts';
import { selectPacienteById } from '../../../shared/helpers/db/paciente/selectPacienteById.ts';
import { insertPaciente } from '../../../shared/helpers/db/paciente/insertPaciente.ts';
import { selectPacienteByDocument } from '../../../shared/helpers/db/paciente/selectPacienteByDocument.ts';

const createdByTag = 'PLAYWRIGHT E2E PATIENTS';
const apiUserData = getUserData('./.auth/user.api.json');

if (!apiUserData) {
  throw new Error('No API user session found in .auth/user.api.json');
}

test.use({ storageState: './.auth/user.ui.json' });

test.describe('E2E /patients - Patients management', () => {
  test.beforeEach(async ({ page }) => {
    const patientsPage = new PatientsPage(page);
    await patientsPage.goto();
  });

  test('Should validate patients page marker text', async ({ page }) => {
    const patientsPage = new PatientsPage(page);

    await patientsPage.expectLoaded();
  });

  test('Should paginate patients list successfully', async ({ page }) => {
    const patientsPage = new PatientsPage(page);

    for (let index = 0; index < 30; index++) {
      await insertPaciente(
        {
          name: faker.person.fullName(),
          document: generateCPF(),
        },
        createdByTag
      );
    }

    await page.reload();

    const firstRowPageOne = await patientsPage.getFirstPatientRowText();
    await patientsPage.goToNextPage();
    const firstRowPageTwo = await patientsPage.getFirstPatientRowText();

    expect(firstRowPageOne).not.toBe(firstRowPageTwo);
  });

  test('Should create patient successfully', async ({ page, request }) => {
    const patientsPage = new PatientsPage(page);
    const managePatientDialog = new ManagePatientDialogPage(page);

    const patientName = faker.person.fullName();
    const patientDocument = generateCPF();

    await patientsPage.openNewPatientDialog();
    await managePatientDialog.expectNewDialogOpened();
    await managePatientDialog.fillPatient(patientName, patientDocument);
    await managePatientDialog.submit();

    await managePatientDialog.expectSnackbarMessage('Paciente registrado com sucesso');

    const patientsFromDatabase = await selectPacienteByDocument(patientDocument);

    expect(patientsFromDatabase.length).toBeGreaterThan(0);
    expect(patientsFromDatabase[0].name).toContain(patientName);
    expect(patientsFromDatabase[0].document).toBe(patientDocument);

    const response = await pacienteServices.findAll(request, apiUserData.accessToken, 1, 100);

    expect(response.status()).toBe(200);

    const { data } = await response.json();
    const createdPatientFromApi = data.find((patient: any) => patient.id === patientsFromDatabase[0].id);

    expect(createdPatientFromApi).toBeTruthy();
    expect(createdPatientFromApi.name).toContain(patientName);
    expect(createdPatientFromApi.document).toBe(patientDocument);
  });

  test('Should show invalid CPF error when creating patient', async ({ page }) => {
    const patientsPage = new PatientsPage(page);
    const managePatientDialog = new ManagePatientDialogPage(page);

    await patientsPage.openNewPatientDialog();
    await managePatientDialog.expectNewDialogOpened();
    await managePatientDialog.fillPatient(faker.person.fullName(), '11111111111');
    await managePatientDialog.submit();

    await managePatientDialog.expectSnackbarMessage('CPF inválido.');
    await managePatientDialog.expectInvalidDocumentError();
  });

  test('Should show required name error when creating patient without name', async ({ page }) => {
    const patientsPage = new PatientsPage(page);
    const managePatientDialog = new ManagePatientDialogPage(page);

    await patientsPage.openNewPatientDialog();
    await managePatientDialog.expectNewDialogOpened();
    await managePatientDialog.fillPatient('', generateCPF());
    await managePatientDialog.submit();

    await managePatientDialog.expectSnackbarMessage('Preencha todos os campos obrigatórios.');
    await managePatientDialog.expectRequiredFieldsError(1);
  });

  test('Should show required document error when creating patient without document', async ({ page }) => {
    const patientsPage = new PatientsPage(page);
    const managePatientDialog = new ManagePatientDialogPage(page);

    await patientsPage.openNewPatientDialog();
    await managePatientDialog.expectNewDialogOpened();
    await managePatientDialog.fillPatient(faker.person.fullName(), '');
    await managePatientDialog.submit();

    await managePatientDialog.expectSnackbarMessage('Preencha todos os campos obrigatórios.');
    await managePatientDialog.expectRequiredFieldsError(1);
  });

  test('Should edit patient successfully with DB precondition', async ({ request }) => {
    const createdPatient = await insertPaciente(
      {
        name: faker.person.fullName(),
        document: generateCPF(),
      },
      createdByTag
    );

    const updatedName = faker.person.fullName();
    const updatedDocument = generateCPF();

    const response = await pacienteServices.update(
      request,
      createdPatient.id,
      { name: updatedName, document: updatedDocument },
      apiUserData.accessToken
    );

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('id', createdPatient.id);
    expect(responseBody).toHaveProperty('name', updatedName);
    expect(responseBody).toHaveProperty('document', updatedDocument);

    const patientsFromDatabase = await selectPacienteByDocument(updatedDocument);

    expect(patientsFromDatabase.length).toBeGreaterThan(0);
    expect(patientsFromDatabase[0].id).toBe(createdPatient.id);
    expect(patientsFromDatabase[0].name).toContain(updatedName);
    expect(patientsFromDatabase[0].document).toBe(updatedDocument);
  });

  test('Should delete patient successfully with DB precondition', async ({ request }) => {
    const createdPatient = await insertPaciente(
      {
        name: faker.person.fullName(),
        document: generateCPF(),
      },
      createdByTag
    );

    const response = await pacienteServices.delete(request, createdPatient.id, apiUserData.accessToken);

    expect(response.status()).toBe(204);

    const patientFromDatabase = await selectPacienteById(createdPatient.id);

    expect(patientFromDatabase.length).toBe(0);
  });
});
