import { APIRequestContext } from '@playwright/test';
import { headers } from '../../shared/headers.ts';
import dotenv from 'dotenv';
import { IPacienteRequest } from './repository/paciente.types.ts';
dotenv.config();

export default function update(request: APIRequestContext, pacienteId: string, paciente: IPacienteRequest, accessToken: string) {
  const payload: IPacienteRequest = {
    name: paciente.name,
    document: paciente.document,
  };

  const response = request.put(`${process.env.BASE_API_URL}/pacientes/${pacienteId}`, {
    data: payload,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}
