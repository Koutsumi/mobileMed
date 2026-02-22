import { query } from '../../../db';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { IAuthLoginRequest } from '../../../../modules/auth/repository/login.types';
import bcrypt from "bcryptjs";

export async function insertUsersystem(user: IAuthLoginRequest, createdby: string = 'PLAYWRIGHT', identification: string = '') {
  const id = uuidv4();
  const name = `${faker.person.fullName()} ${identification}`;
  const email = user.email.toLowerCase();
  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    await query(
      `INSERT INTO usersystem (id, name, email, password, status, createdat, createdby, updatedat, updatedby) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, name, email, hashedPassword, 1, new Date(), createdby, new Date(), createdby]
    );

    return { id, name, email };
  } catch (error: any) {
    console.error('❌ Error inserting user:', {
      message: error.message,
      detail: error.detail,
      code: error.code 
    });
    
    throw new Error(`Error inserting user: ${error.message}`);
  }
}