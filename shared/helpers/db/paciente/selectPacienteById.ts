import { query } from '../../../db';

type DbPaciente = {
  id: string;
  name: string;
  document: string;
  createdby: string;
};

export async function selectPacienteById(id: string): Promise<DbPaciente[]> {
  const sql = `
    SELECT id, name, document, createdby
    FROM patient
    WHERE id = $1
    ORDER BY createdat DESC
  `;

  const values = [id];

  try {
    const result = await query(sql, values);
    return result.rows as DbPaciente[];
  } catch (error) {
    console.error('❌ Error selecting patient by id:', error);
    throw error;
  }
}
