import { IPacienteRequest } from './repository/paciente.types.ts';
import { APIRequestContext } from "@playwright/test"
import { headers } from '../../shared/headers.ts'
import dotenv from 'dotenv'
dotenv.config()

export default function login(request: APIRequestContext, paciente: IPacienteRequest, accessToken?: string) {
    
    const payload: IPacienteRequest = {
        name: paciente.name,
        document: paciente.document,
    }
    
    const response = request.post(`${process.env.BASE_API_URL}/pacientes`, {
        data: payload,
        headers: {
            ...headers,
            Authorization: `Bearer ${accessToken}`
        }
    });

    return response;

}