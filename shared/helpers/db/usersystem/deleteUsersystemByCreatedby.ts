import { query } from '../../../db';

export async function deleteUsersystemByCreatedby(createdby: string = 'PLAYWRIGHT') {
  const sql = `DELETE FROM usersystem WHERE createdby = $1`;
  const values = [createdby];

  try {
    const result = await query(sql, values);
    console.log(`✅ usersystem clean: ${result.rowCount} removed users.`);
    return result.rowCount;
  } catch (error) {
    console.error('❌ Error deleting users:', error);
    throw error;
  }
}