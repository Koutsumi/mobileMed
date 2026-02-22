import { query } from '../../../db';

type DbExam = {
  id: string;
  patientid: string;
  modality: string;
};

export async function selectExamById(id: string): Promise<DbExam[]> {
  const sql = `
    SELECT id, patientid, modality
    FROM exam
    WHERE id = $1
  `;

  const values = [id];

  try {
    const result = await query(sql, values);
    return result.rows as DbExam[];
  } catch (error) {
    console.error('❌ Error selecting exam by id:', error);
    throw error;
  }
}
