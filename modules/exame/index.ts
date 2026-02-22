import create from './create.ts';
import findAll from './findAll.ts';
import findAllPaginated from './findAllPaginated.ts';
import findOne from './findOne.ts';
import update from './update.ts';
import remove from './delete.ts';

export default {
  create,
  findAll,
  findAllPaginated,
  findOne,
  update,
  delete: remove,
};
