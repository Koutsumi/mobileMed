import { query } from '../../../db';

export async function deleteUsersystemById(id: string) {
  if (process.env.PERSIST_TEST_DATA !== 'false') {
    return;
  }

  const sql = 'DELETE FROM usersystem WHERE id = $1';

  try {
    await query(sql, [id]);
  } catch (error) {
    console.error('❌ Error deleting usersystem by id:', error);
    throw error;
  }
}
