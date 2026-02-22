import { query } from '../../../db';

export async function deletePacienteById(id: string) {
  if (process.env.PERSIST_TEST_DATA !== 'false') {
    return;
  }

  const sql = 'DELETE FROM patient WHERE id = $1';

  try {
    await query(sql, [id]);
  } catch (error) {
    console.error('❌ Error deleting paciente by id:', error);
    throw error;
  }
}
