import { APIRequest, expect } from '@playwright/test';
import authServices from '../index.ts';
import { IAuthLoginRequest } from '../repository/login.types.ts';
import fs from 'fs';

export async function loginAndStoreSession(request : APIRequest, user : IAuthLoginRequest, authFile : string)  : Promise<string | false> {
     const context = await request.newContext();

     const response = await authServices.login(context, user);
    
      expect(response.status()).toBe(200);
      if(response.status() === 200){
        const { data } = await response.json();
        const authToken = {
            "userId": data.userId,
            "userName": data.userName,
            "userEmail": data.userEmail,
            "expiresIn": data.expiresIn,
            "accessToken":data.accessToken,
            "expiresAt":new Date(Date.now() + data.expiresIn * 1000).toISOString()
        };

        const storageState = {
            cookies: [],
            origins: [
                {
                    origin: process.env.BASE_WEB_URL || '', // Altere para a URL base do seu app
                    localStorage: [
                        {
                            name: 'auth_token', // O nome da chave que seu app usa
                            value: JSON.stringify(authToken)
                        }
                    ]
                }
            ]
        };
    
        fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
        return data.accessToken;
      }
      return false;
}
