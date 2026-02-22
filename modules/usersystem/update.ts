import { APIRequestContext } from '@playwright/test';
import { headers } from '../../shared/headers.ts';
import dotenv from 'dotenv';
import { IUserSystemRequest } from './repository/usersystem.types.ts';
dotenv.config();

export default function update(request: APIRequestContext, userSystemId: string, userSystem: IUserSystemRequest, accessToken: string) {
  const response = request.put(`${process.env.BASE_API_URL}/user-system/${userSystemId}`, {
    data: userSystem,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}
