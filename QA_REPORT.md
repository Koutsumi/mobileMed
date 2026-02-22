# QA Report - API and E2E Defects

## Requisições com erro - Retorna status 500

- Exame by id `GET /exames/${id}`
- Paciente by id `GET /pacientes/${id}`
- Create Usersystem `POST /user-system`
- Update Usersystem `PUT /user-system/{id}`

## Rotas não usadas no sistema

- Update exame `PUT /exames/{id}`
- user-system (rota base `/user-system`)

## Rotas sem retorno/response

Não retorna no sistema, exames apenas inseridos no banco:

- Create exame `POST /exames`

## ERROS

- Rota de delete de paciente com ID não registrado retornando `204` (esperado `404`)
- Rota de delete de user-system com ID não registrado retornando `204` (esperado `404`)

## Impacto no contrato

- Quebra de previsibilidade para consumidores da API.
- Dificuldade em validar contrato em testes automatizados.
- Necessidade de manter `TODO` e validações temporárias até correções de backend.

---

## Defeitos E2E Encontrados

### 1) Paciente com CPF inválido é cadastrado mesmo com validação de erro

- Fluxo: Cadastro de paciente pela UI.
- Cenário esperado: ao informar CPF inválido, exibir erro e impedir persistência.
- Comportamento observado:
  - UI apresenta mensagem de sucesso (`Paciente registrado com sucesso`).
  - Registro é persistido pela API/banco mesmo com CPF inválido.
  - Teste falha aguardando `CPF inválido.` e recebe mensagem de sucesso.
- Evidência de execução:
  - `Locator: locator('mat-snack-bar-container')`
  - `Expected substring: CPF inválido.`
  - `Received: Paciente registrado com sucesso`
- Impacto:
  - Inconsistência crítica de validação de regra de negócio.
  - Risco de dados inválidos em produção.

### 2) Exame com mensagem de sucesso não é persistido

- Fluxo: criação de exame pela UI.
- Cenário esperado: após sucesso (`Exame criado com sucesso`), exame deve existir na listagem e no banco.
- Comportamento observado:
  - UI exibe mensagem de sucesso.
  - Exame não aparece na tela de exames para o paciente informado.
  - Falha de locator ao validar linha na tabela de exames.
- Evidência de execução:
  - `Error: expect(locator).toBeVisible() failed`
  - `Locator: getByRole('cell', { name: 'MARIA HELENA SARAIVA' }).first().locator('xpath=ancestor::tr[1]').first()`
  - `Error: element(s) not found`
- Impacto:
  - Falso positivo de sucesso na UI.
  - Quebra de confiabilidade do fluxo principal de cadastro de exame.
