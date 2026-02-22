import { test, expect } from '@playwright/test';
import authServices from '../../../../modules/auth/index.ts';
import usersFixture from '../../../../fixtures/users.fixture.ts';
import { insertUsersystem } from '../../../../shared/helpers/db/usersystem/insertUsersystem.ts';
import { deleteUsersystemByCreatedby } from '../../../../shared/helpers/db/usersystem/deleteUsersystemByCreatedby.ts';

const user = usersFixture.user();
const identification = 'PLAYWRIGHT LOGIN TEST ERRORS';

test.describe('POST /auth/login - Errors', () => {

    test.beforeAll(async () => {
        await deleteUsersystemByCreatedby(identification);
        await insertUsersystem(user, identification);
    });

    test('Should return 400 Bad Request when email is missing', async ({ request }) => {
        const response = await authServices.login(request, {
            email: '',
            password: user.password
        });

        expect(response.status()).toBe(400);

        const { statusCode, message, stark, url } = await response.json();

        expect(statusCode).toBe(400);
        expect(message).toEqual([
            'email should not be empty',
            'email must be an email'
        ]);
        expect(stark).toContain('BadRequestException: Bad Request Exception');
        expect(url).toContain('/auth/login');
    });
    
    test('Should return 400 Bad Request when password is missing', async ({ request }) => {
        const response = await authServices.login(request, {
            email: user.email,
            password: ''
        });

        expect(response.status()).toBe(400);

        const { statusCode, message, stark, url } = await response.json();

        expect(statusCode).toBe(400);
        expect(message).toEqual(['password should not be empty']);
        expect(stark).toContain('BadRequestException: Bad Request Exception');
        expect(url).toContain('/auth/login');
    });

    test('Should return 404 Not Found with invalid password', async ({ request }) => {
        const response = await authServices.login(request, {
            email: user.email,
            password: 'invalid-password'
        });

        expect(response.status()).toBe(404);

        const { statusCode, message, data, url } = await response.json();

        expect(statusCode).toBe(404);
        expect(message).toBe('Invalid credentials');
        expect(data).toBeNull();
        expect(url).toContain(`/auth/login/${user.email}`);
    });

    test('Should return 404 Not Found when user does not exist', async ({ request }) => {
        const unregisteredUserEmail = `not-found-${Date.now()}@mobilemed.com`;

        const response = await authServices.login(request, {
            email: unregisteredUserEmail,
            password: user.password
        });

        expect(response.status()).toBe(404);

        const { statusCode, message, data, url } = await response.json();

        expect(statusCode).toBe(404);
        expect(message).toBe('Invalid credentials');
        expect(data).toBeNull();
        expect(url).toContain(`/auth/login/${unregisteredUserEmail}`);
    });
});
