import { expect, APIRequestContext, test } from '@playwright/test';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { ExamsPage } from '../../../modules/exame/page/exams.page.ts';
import { ManageExamDialogPage } from '../../../modules/exame/page/manage-exam-dialog.page.ts';
import pacienteServices from '../../../modules/paciente/index.ts';
import { PatientsPage } from '../../../modules/paciente/page/patients.page.ts';
import { generateCPF } from '../../../shared/generateCpf.ts';
import { getUserData } from '../../../shared/helpers/getUserData.ts';
import { insertExam } from '../../../shared/helpers/db/exam/insertExam.ts';
import { selectExamById } from '../../../shared/helpers/db/exam/selectExamById.ts';

type CreatedPatient = {
  id: string;
  name: string;
  document: string;
};

const uiUserData = getUserData('./.auth/user.ui.json');

if (!uiUserData) {
  throw new Error('No UI user session found in .auth/user.ui.json');
}

async function createPatientByApi(request: APIRequestContext): Promise<CreatedPatient> {
  const patient = {
    name: faker.person.fullName(),
    document: generateCPF(),
  };

  const createPatientResponse = await pacienteServices.create(request, patient, uiUserData.accessToken);

  expect(createPatientResponse.status()).toBe(201);

  const createdPatient = await createPatientResponse.json();

  return {
    id: createdPatient.id,
    name: createdPatient.name,
    document: createdPatient.document,
  };
}

test.use({ storageState: './.auth/user.ui.json' });

test.describe('E2E /exams - Exams management', () => {
  test.beforeEach(async ({ page }) => {
    const patientsPage = new PatientsPage(page);
    await patientsPage.goto();
  });

  test('Should show required modality error when submitting empty exam form', async ({ page, request }) => {
    const patientsPage = new PatientsPage(page);
    const manageExamDialog = new ManageExamDialogPage(page);
    const createdPatient = await createPatientByApi(request);

    await page.reload();
    await patientsPage.expectPatientInTableByDocument(createdPatient.document);
    await patientsPage.openNewExamDialogByPatientDocument(createdPatient.document);
    await manageExamDialog.expectNewDialogOpened();
    await manageExamDialog.submit();

    await manageExamDialog.expectSnackbarMessage('Preencha todos os campos obrigatórios.', 'error');
    await manageExamDialog.expectRequiredFieldError();
  });

  test('Should create exam and validate it on exams page', async ({ page, request }) => {
    const patientsPage = new PatientsPage(page);
    const examsPage = new ExamsPage(page);
    const manageExamDialog = new ManageExamDialogPage(page);
    const createdPatient = await createPatientByApi(request);

    await page.reload();
    await patientsPage.expectPatientInTableByDocument(createdPatient.document);
    await patientsPage.openNewExamDialogByPatientDocument(createdPatient.document);
    await manageExamDialog.expectNewDialogOpened();
    await manageExamDialog.chooseModality('CT');
    await manageExamDialog.submit();

    await manageExamDialog.expectSnackbarMessage('Exame criado com sucesso', 'success');

    await examsPage.goto();
    await examsPage.expectExamInTable(createdPatient.name, 'CT');
  });

  test('Should delete exam successfully with DB precondition', async ({ page, request }) => {
    const examsPage = new ExamsPage(page);
    const createdPatient = await createPatientByApi(request);

    const createdExam = await insertExam(createdPatient.id, 'PLAYWRIGHT E2E EXAMS', 'MR');

    await examsPage.goto();
    await examsPage.expectExamInTable(createdPatient.name, 'MR');
    await examsPage.deleteExamByPatientName(createdPatient.name);

    // TODO Sistema não esta exibindo a mensagem de sucesso após a exclusão do exame, validar se é um bug ou se a mensagem foi removida
    //await examsPage.expectSnackbarMessage(`Exame do paciente ${createdPatient.name} removido com sucesso`);
    await expect
      .poll(
        async () => {
          const examFromDatabase = await selectExamById(createdExam.id);
          return examFromDatabase.length;
        },
        {
          timeout: 10000,
          intervals: [250, 500, 1000],
        }
      )
      .toBe(0);
  });
});
