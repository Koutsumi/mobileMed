import { APIRequestContext } from '@playwright/test';
import { headers } from '../../shared/headers.ts';
import dotenv from 'dotenv';
import { IExamRequest } from './repository/exame.types.ts';
dotenv.config();

export default function update(request: APIRequestContext, examId: string, exam: IExamRequest, accessToken: string) {
  const response = request.put(`${process.env.BASE_API_URL}/exames/${examId}`, {
    data: exam,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}
