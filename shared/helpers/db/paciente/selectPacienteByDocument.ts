import { query } from '../../../db';

type DbPaciente = {
  id: string;
  name: string;
  document: string;
  createdby: string;
};

export async function selectPacienteByDocument(document: string): Promise<DbPaciente[]> {
  const sql = `
    SELECT id, name, document, createdby
    FROM patient
    WHERE document = $1
    ORDER BY createdat DESC
  `;

  const values = [document];

  try {
    const result = await query(sql, values);
    return result.rows as DbPaciente[];
  } catch (error) {
    console.error('❌ Error selecting patient by document:', error);
    throw error;
  }
}
