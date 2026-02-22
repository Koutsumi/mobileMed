import { query } from '../../db';

export async function deleteExamesByCreatedByContains(keyword: string) {
  const sql = `DELETE FROM exam WHERE createdby ILIKE '%' || $1 || '%'`;
  const values = [keyword];

  try {
    const result = await query(sql, values);
    console.log(`✅ exams deleted: ${result.rowCount} removed exames.`);
    return result.rowCount;
  } catch (error) {
    console.error('❌ Error deleting exams:', error);
    throw error;
  }
}
