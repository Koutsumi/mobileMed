import { query } from '../../../db';

export async function deleteExamById(id: string) {
  if (process.env.PERSIST_TEST_DATA !== 'false') {
    return;
  }

  const sql = 'DELETE FROM exam WHERE id = $1';

  try {
    await query(sql, [id]);
  } catch (error) {
    console.error('❌ Error deleting exam by id:', error);
    throw error;
  }
}
