import { test as setup } from '@playwright/test';
import { deleteExamesByCreatedByContains } from '../../../shared/helpers/db/cleanExamesTable.ts';
import { deletePacientesByCreatedByContains } from '../../../shared/helpers/db/cleanPacientesTable.ts';

setup('Should clean e2e patients data before patients suite', async () => {
  await deleteExamesByCreatedByContains('UI');
  await deletePacientesByCreatedByContains('UI');
  await deletePacientesByCreatedByContains('E2E PATIENTS');
});
