import { test as setup } from '@playwright/test';
import { deleteExamesByCreatedByContains } from '../../../shared/helpers/db/cleanExamesTable.ts';
import { deletePacientesByCreatedByContains } from '../../../shared/helpers/db/cleanPacientesTable.ts';

setup('Should clean exames and pacientes data before post suite', async () => {
  await deleteExamesByCreatedByContains('API');
  await deletePacientesByCreatedByContains('API');
});
