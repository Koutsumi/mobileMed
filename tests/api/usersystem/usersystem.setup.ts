import { test as setup } from '@playwright/test';
import { deleteUsersystemByCreatedByContains } from '../../../shared/helpers/db/usersystem/deleteUsersystemByCreatedByContains.ts';

setup('Should clean usersystem data before usersystem suite', async () => {
  await deleteUsersystemByCreatedByContains('API');
});
