import { APIRequestContext } from '@playwright/test';
import { headers } from '../../shared/headers.ts';
import dotenv from 'dotenv';
dotenv.config();

export default function findAllPaginated(request: APIRequestContext, accessToken: string, page: number = 1, pageSize: number = 10) {
  const response = request.get(`${process.env.BASE_API_URL}/exames/paginated?page=${page}&pageSize=${pageSize}`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}
