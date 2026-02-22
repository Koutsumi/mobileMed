import { query } from '../../../db';

export async function selectUsersystemByEmail(email: string) {
  const sql = `SELECT * FROM usersystem WHERE email = $1`;
  const values = [email];

  try {
    const result = await query(sql, values);
    console.log(`✅ usersystem selected: ${result.rowCount} rows returned.`);
    return result.rows;
  } catch (error) {
    console.error('❌ Error selecting users:', error);
    throw error;
  }
}