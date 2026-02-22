import { IExamRequest } from '../modules/exame/repository/exame.types.ts';
import { v4 as uuidv4 } from 'uuid';

const modalities = ['CR', 'CT', 'DX', 'MG', 'MR', 'NM', 'OT', 'PT', 'RF', 'US', 'XA'];

export default {
  exam: function (patientId: string): IExamRequest {
    const randomModality = modalities[Math.floor(Math.random() * modalities.length)];

    const data: IExamRequest = {
      patientId,
      modality: randomModality,
      idempotencyKey: uuidv4(),
      requestedAt: new Date().toISOString(),
    };

    return data;
  },
};
