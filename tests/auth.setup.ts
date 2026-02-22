import { expect, test as setup, request } from '@playwright/test';
import usersFixture from '../fixtures/users.fixture.ts';
import { loginAndStoreSession } from '../modules/auth/helpers/loginAndStoreSession.ts';
import { insertUsersystem } from '../shared/helpers/db/usersystem/insertUsersystem.ts';
import { deleteUsersystemByCreatedby } from '../shared/helpers/db/usersystem/deleteUsersystemByCreatedby.ts';

const authUiFile = './.auth/user.ui.json';
const authApiFile = './.auth/user.api.json';
const userUi = usersFixture.user('ui');
const userApi = usersFixture.user('api');

setup.beforeAll(async () => {
    await deleteUsersystemByCreatedby();
    await insertUsersystem(userUi, 'PLAYWRIGHT', 'UI');
    await insertUsersystem(userApi, 'PLAYWRIGHT', 'API');
});

setup('Should insert user and store session - UI', async () => {

    const isAuthenticated = await loginAndStoreSession(request, userUi, authUiFile);
    expect(isAuthenticated).toBeTruthy();
    
});

setup('Should insert user and store session - API', async () => {

    const isAuthenticated = await loginAndStoreSession(request, userApi, authApiFile);
    expect(isAuthenticated).toBeTruthy();
    
});
