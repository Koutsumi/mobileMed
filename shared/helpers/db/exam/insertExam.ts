import { query } from '../../../db';
import { v4 as uuidv4 } from 'uuid';

export async function insertExam(patientId: string, createdBy: string = 'PLAYWRIGHT API', modality: string = 'CT') {
  const id = uuidv4();
  const idempotencyKey = uuidv4();

  const sql = `
    INSERT INTO exam (id, patientid, modality, idempotencykey, requestedat, createdat, createdby, updatedat, updatedby)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;

  const values = [id, patientId, modality, idempotencyKey, new Date(), new Date(), createdBy, new Date(), createdBy];

  try {
    await query(sql, values);
    console.log(`✅ exam inserted: ${id}`);
    return { id, patientId, modality, idempotencyKey };
  } catch (error) {
    console.error('❌ Error inserting exam:', error);
    throw error;
  }
}
