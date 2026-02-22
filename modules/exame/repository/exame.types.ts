export interface IExamRequest {
  patientId: string;
  modality: string;
  idempotencyKey: string;
  requestedAt?: string;
}
