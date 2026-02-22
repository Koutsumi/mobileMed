import { test as setup } from '@playwright/test';
import { deletePacientesByCreatedByContains } from '../../../shared/helpers/db/cleanPacientesTable.ts';

setup('Should clean pacientes data before pacientes suite', async () => {
  await deletePacientesByCreatedByContains('API');
});
