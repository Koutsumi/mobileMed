# Shared Globals

Esta seção documenta as funções e utilitários globais localizados em `playwright/shared`.

## Core

### `shared/db.ts`

- `query(text: string, params?: any[])`
- Executa queries SQL usando pool do PostgreSQL.

### `shared/headers.ts`

- `headers`
- Cabeçalhos padrão usados em requisições HTTP (`Content-Type: application/json`).

### `shared/generateCpf.ts`

- `generateCPF()`
- Gera CPF válido para massa de testes.

### `shared/helpers/getUserData.ts`

- `getUserData(path: string)`
- Lê arquivo de sessão (`.auth`) e retorna token/metadata do usuário logado.

## DB Helpers - Limpeza

### `shared/helpers/db/cleanExamesTable.ts`

- `deleteExamesByCreatedByContains(keyword: string)`
- Remove exames por `createdby` no setup de suíte.

### `shared/helpers/db/cleanPacientesTable.ts`

- `deletePacientesByCreatedByContains(keyword: string)`
- Remove pacientes por `createdby` no setup de suíte.

### `shared/helpers/db/usersystem/deleteUsersystemByCreatedByContains.ts`

- `deleteUsersystemByCreatedByContains(keyword: string)`
- Remove usuários de sistema por `createdby` parcial no setup.

### `shared/helpers/db/usersystem/deleteUsersystemByCreatedby.ts`

- `deleteUsersystemByCreatedby(createdby?: string)`
- Remove usuários por `createdby` exato.

## DB Helpers - Seed / Inserção

### `shared/helpers/db/exam/insertExam.ts`

- `insertExam(patientId: string, createdBy?: string, modality?: string)`
- Insere exame diretamente no banco para pré-requisito de testes.

### `shared/helpers/db/paciente/insertPaciente.ts`

- `insertPaciente(paciente?: IPacienteRequest, createdBy?: string)`
- Insere paciente diretamente no banco para pré-requisito de testes.

### `shared/helpers/db/usersystem/insertUsersystem.ts`

- `insertUsersystem(user: IAuthLoginRequest, createdby?: string, identification?: string)`
- Insere usuário de sistema diretamente no banco, incluindo hash de senha.

## DB Helpers - Consulta

### `shared/helpers/db/usersystem/selectUsersystemByEmail.ts`

- `selectUsersystemByEmail(email: string)`
- Busca usuários no banco por email.

## DB Helpers - Delete por ID

> Observação: as funções abaixo respeitam `PERSIST_TEST_DATA`. Se `PERSIST_TEST_DATA !== 'false'`, não removem registros.

### `shared/helpers/db/exam/deleteExamById.ts`

- `deleteExamById(id: string)`

### `shared/helpers/db/paciente/deletePacienteById.ts`

- `deletePacienteById(id: string)`

### `shared/helpers/db/usersystem/deleteUsersystemById.ts`

- `deleteUsersystemById(id: string)`
