import { v4 as uuidv4 } from 'uuid';
import { query } from '../../../db';
import { IPacienteRequest } from '../../../../modules/paciente/repository/paciente.types.ts';
import pacienteFixture from '../../../../fixtures/paciente.fixture.ts';

export async function insertPaciente(paciente?: IPacienteRequest, createdBy: string = 'PLAYWRIGHT API') {
  const data = paciente ?? pacienteFixture.paciente();
  const id = uuidv4();

  const sql = `
    INSERT INTO patient (id, name, document, createdat, createdby, updatedat, updatedby)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  const values = [id, data.name, data.document, new Date(), createdBy, new Date(), createdBy];

  await query(sql, values);

  return { id, ...data };
}
