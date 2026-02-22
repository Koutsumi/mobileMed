import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('DELETE /exames/:id - Errors', () => {
  test('Should return 401 when no token is provided', async ({ request }) => {
    const examId = randomUUID();
    const response = await request.delete(`${process.env.BASE_API_URL}/exames/${examId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);

    const { statusCode, message, stark, url } = await response.json();

    expect(statusCode).toBe(401);
    expect(message).toBe('Unauthorized');
    expect(stark).toContain('UnauthorizedException: Unauthorized');
    expect(url).toContain(`/exames/${examId}`);
  });
});
