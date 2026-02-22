import { APIRequestContext } from '@playwright/test';
import { headers } from '../../shared/headers.ts';
import dotenv from 'dotenv';
dotenv.config();

export default function findOne(request: APIRequestContext, userSystemId: string, accessToken: string) {
  const response = request.get(`${process.env.BASE_API_URL}/user-system/${userSystemId}`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}
