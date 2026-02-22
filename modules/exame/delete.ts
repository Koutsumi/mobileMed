import { APIRequestContext } from '@playwright/test';
import { headers } from '../../shared/headers.ts';
import dotenv from 'dotenv';
dotenv.config();

export default function remove(request: APIRequestContext, examId: string, accessToken: string) {
  const response = request.delete(`${process.env.BASE_API_URL}/exames/${examId}`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}
