import { test, expect } from '@playwright/test';
import authServices from '../../../../modules/auth/index.ts';
import { selectUsersystemByEmail } from '../../../../shared/helpers/db/usersystem/selectUsersystemByEmail.ts';
import usersFixture from '../../../../fixtures/users.fixture.ts';
import { insertUsersystem } from '../../../../shared/helpers/db/usersystem/insertUsersystem.ts';
import { DbUsersystem } from '../../../../shared/types/db/usersystem.types.ts';
import { deleteUsersystemByCreatedby } from '../../../../shared/helpers/db/usersystem/deleteUsersystemByCreatedby.ts';

const user = usersFixture.user();
const identification = 'PLAYWRIGHT LOGIN TEST';

test.describe('POST /auth/login - Success', () => {

    let userData : DbUsersystem[];

    test.beforeAll(async () => {
        await deleteUsersystemByCreatedby(identification);
        await insertUsersystem(user, identification);
        userData = await selectUsersystemByEmail(user.email);
         if (userData.length === 0) {
             throw new Error('No user found with the specified email');
         }
    });

    test('Should login successfully with valid credentials', async ({ request }) => {
        const response = await authServices.login(request, user);
        
        expect(response.status()).toBe(200);
        const {statusCode, message, data, url} = await response.json();

        expect(statusCode).toBe(200);
        expect(message).toBe('UserSystem found');
        expect(data).toHaveProperty('userId', userData[0].id);
        expect(data).toHaveProperty('userName', userData[0].name);
        expect(data).toHaveProperty('userEmail', userData[0].email);
        expect(data.expiresIn).toBe(86400);
        expect(data.accessToken).toBeTruthy();
        expect(url).toContain(`/auth/login/${userData[0].email}`);
    })
});