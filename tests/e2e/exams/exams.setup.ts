import { test as setup } from '@playwright/test';
import { deleteExamesByCreatedByContains } from '../../../shared/helpers/db/cleanExamesTable.ts';
import { deletePacientesByCreatedByContains } from '../../../shared/helpers/db/cleanPacientesTable.ts';

setup('Should clean e2e exams data before exams suite', async () => {
  await deleteExamesByCreatedByContains('UI');
  await deleteExamesByCreatedByContains('E2E EXAMS');
  await deletePacientesByCreatedByContains('UI');
  await deletePacientesByCreatedByContains('E2E EXAMS');
});
