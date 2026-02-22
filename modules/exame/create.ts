import { APIRequestContext } from '@playwright/test';
import { headers } from '../../shared/headers.ts';
import dotenv from 'dotenv';
import { IExamRequest } from './repository/exame.types.ts';
dotenv.config();

export default function create(request: APIRequestContext, exam: IExamRequest, accessToken: string) {
  const response = request.post(`${process.env.BASE_API_URL}/exames`, {
    data: exam,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}
