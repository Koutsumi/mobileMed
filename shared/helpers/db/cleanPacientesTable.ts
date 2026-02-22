import { query } from '../../db';

export async function deletePacientesByCreatedByContains(keyword: string) {
  const sql = `DELETE FROM patient WHERE createdby ILIKE '%' || $1 || '%'`;
    const values = [keyword];

  try {
    const result = await query(sql, values);
    console.log(`✅ patients deleted: ${result.rowCount} removed pacientes.`);
    return result.rowCount;
  } catch (error) {
    console.error('❌ Error deleting patients:', error);
    throw error;
  }
}