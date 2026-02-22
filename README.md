# MobileMed QA - Playwright

Suite de testes automatizados do projeto **MobileMed**, cobrindo:

- **API tests** (contrato, regressão, cenários de erro)
- **E2E tests** (fluxos críticos de interface com Page Objects)

---

## Visão Geral

Este projeto foi estruturado para garantir:

- **Independência total entre testes**
- **Pré-condições determinísticas** via API/DB
- **Limpeza de massa no início das suítes**
- **Rastreabilidade de falhas** com relatório HTML

---

## Stack

- `@playwright/test`
- `pg` (helpers de banco)
- `dotenv`
- `@faker-js/faker`
- `uuid`

---

## Estrutura de Pastas

```text
playwright/
├── fixtures/                 # Massa randômica/reutilizável
├── modules/                  # Clients por domínio + page objects
│   ├── auth/
│   ├── paciente/
│   │   └── page/
│   ├── exame/
│   │   └── page/
│   └── usersystem/
├── shared/                   # DB, helpers globais, utilitários
├── tests/
│   ├── auth.setup.ts         # Setup global de autenticação
│   ├── api/                  # Testes de API
│   └── e2e/                  # Testes E2E
├── rules/                    # Convenções de código e testes
├── QA_REPORT.md              # Bugs/inconsistências mapeadas
└── playwright.config.ts
```

---

## Estratégia de Testes

### 1. Independência

- Um teste **não depende** de outro.
- Toda pré-condição é criada no próprio teste (API/DB).

### 2. Higiene de dados

- Limpeza ocorre em `*.setup.ts` por módulo.
- Limpeza é feita **no início da suíte**.
- Massa pode permanecer ao final para auditoria.

### 3. Padrão E2E

- Page Objects em `modules/*/page`.
- Seletores priorizam atributos semânticos e texto confiável.
- Sempre validar:
  - marcador da tela correta
  - feedback de erro/sucesso

### 4. Padrão API

- Cada `describe` representa endpoint/feature.
- Nome inclui método HTTP e rota.
- Cada teste valida um comportamento único.

---

## Pré-requisitos

- Node.js 18+
- Banco PostgreSQL da aplicação disponível
- Backend e frontend acessíveis

Variáveis esperadas em `playwright/.env`:

```env
BASE_API_URL="http://localhost:3000"
BASE_WEB_URL="http://localhost:4200"
DATABASE_URL="postgresql://..."
```

---

## Instalação

```bash
cd playwright
npm install
```

---

## Execução

### Listar testes

```bash
npx playwright test --list
```

### Rodar tudo

```bash
npx playwright test
```

### Rodar apenas API

```bash
npx playwright test --project=api-login --project=api-usersystem --project=api-pacientes --project=api-exames --project=api-post
```

### Rodar apenas E2E

```bash
npx playwright test --project=e2e-login --project=e2e-patients --project=e2e-exams
```

### Rodar um arquivo específico

```bash
npx playwright test tests/e2e/exams/exams.spec.ts --project=e2e-exams
```

---

## Relatórios

Após execução:

- Relatório Playwright HTML em `playwright-report/`
- Resultados em `test-results/`

Abrir relatório:

```bash
npx playwright show-report
```

---

## Documentação QA

- `QA_REPORT.md`: defeitos conhecidos de API e E2E
- `SHARED_GLOBALS.md`: guia dos helpers globais

Gerar documentação Compodoc:

```bash
npm run doc:generate
```

---

## Troubleshooting Rápido

### Teste não encontra dados recém-criados

- Confirmar setup de limpeza do módulo
- Confirmar `createdBy` alinhado com filtros de limpeza
- Validar pré-condição via helper de DB antes da ação UI

### Erro de locator em snackbar (strict mode)

- Usar locator por tipo (`custom-success-snackbar` / `custom-error-snackbar`)
- Evitar locator genérico quando há múltiplos snackbars

### Flakiness com paginação

- Navegar por páginas de forma determinística
- Usar texto de range do paginator para validar avanço real

---

## Convenções

As regras obrigatórias do repositório estão em `rules/`.

Destaques:

- Fluxo explícito e legível
- Evitar complexidade no corpo dos testes
- Nomenclatura semântica e consistente
- Reuso de helpers e isolamento de responsabilidades
