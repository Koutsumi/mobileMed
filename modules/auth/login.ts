import { IAuthLoginRequest } from './repository/login.types.ts';
import { APIRequestContext } from "@playwright/test"
import { headers } from '../../shared/headers.ts'
import dotenv from 'dotenv'
dotenv.config()

export default function login(request: APIRequestContext, user: IAuthLoginRequest) {
    
    const payload: IAuthLoginRequest = {
        email: user.email,
        password: user.password
    }
    
    const response = request.post(`${process.env.BASE_API_URL}/auth/login`, {
        data: payload,
        headers: headers
    });

    return response;

}