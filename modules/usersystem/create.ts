import { APIRequestContext } from '@playwright/test';
import { headers } from '../../shared/headers.ts';
import dotenv from 'dotenv';
import { IUserSystemRequest } from './repository/usersystem.types.ts';
dotenv.config();

export default function create(request: APIRequestContext, userSystem: IUserSystemRequest, accessToken: string) {
  const response = request.post(`${process.env.BASE_API_URL}/user-system`, {
    data: userSystem,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}
