import { query } from '../../../db';

export async function deleteUsersystemByCreatedByContains(keyword: string) {
  const sql = `DELETE FROM usersystem WHERE createdby ILIKE '%' || $1 || '%'`;
  const values = [keyword];

  try {
    const result = await query(sql, values);
    console.log(`✅ usersystem clean: ${result.rowCount} removed users.`);
    return result.rowCount;
  } catch (error) {
    console.error('❌ Error deleting users:', error);
    throw error;
  }
}
