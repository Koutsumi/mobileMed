import { IAuthLoginRequest } from "../modules/auth/repository/login.types";
import { v4 as uuidv4 } from 'uuid';

export default {
    user: function(identification : string = '') : IAuthLoginRequest {
        const data : IAuthLoginRequest = {
            email:`user_test${uuidv4()}_${identification}@mobilemed.com`,
            password:"test@123",
        }
        return data
    }
}