# Documentação da API - Mackenzie Wallet

## Configuração do MongoDB Atlas

A aplicação utiliza **MongoDB Atlas** como banco de dados cloud. A conexão está configurada no arquivo `src/app.module.ts`:

```typescript
MongooseModule.forRoot('mongodb+srv://<usuario>:<senha>@webmobile.fr2xgzf.mongodb.net/')
```

**Nota**: Certifique-se de atualizar a string de conexão com suas credenciais do MongoDB Atlas.

---

## Schema de Dados: Transacao

O schema define a estrutura para registrar receitas e despesas do usuário.

### Campos do Schema:

| Campo | Tipo | Descrição | Validações |
|-------|------|-----------|-----------|
| `descricao` | String | Descrição da transação (ex: "Conta de Luz", "Compra de Roupas") | Obrigatório |
| `valor` | Number | Valor monetário da transação | Obrigatório, >= 0 |
| `tipo` | String | Tipo da transação | Obrigatório, apenas "receita" ou "despesa" |
| `categoria` | String | Categoria da transação | Obrigatório, aceita: "Moradia", "Alimentação", "Lazer", "Educação", "Saúde", "Transporte", "Outros" |
| `consumoConsciente` | Boolean | Indica se a despesa foi essencial (true) ou por impulso (false) | Obrigatório |
| `createdAt` | Date | Data de criação (automático) | Gerenciado pelo MongoDB |
| `updatedAt` | Date | Data de atualização (automático) | Gerenciado pelo MongoDB |

---

## Endpoints da API

### 1. POST /transacoes - Criar uma Nova Transação

**Descrição**: Cadastra uma nova receita ou despesa no banco de dados.

**URL**: `POST http://localhost:3000/transacoes`

**Headers**:
```
Content-Type: application/json
```

**Body (Request)**:
```json
{
  "descricao": "Conta de Luz",
  "valor": 150.50,
  "tipo": "despesa",
  "categoria": "Moradia",
  "consumoConsciente": true
}
```

**Response (201 Created)**:
```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

**Validações**:
- `tipo` deve ser exatamente "receita" ou "despesa" (case-insensitive)
- `valor` deve ser um número positivo
- `categoria` deve ser uma das categorias pré-definidas

**Exemplos de Uso**:

```bash
# Receita
curl -X POST http://localhost:3000/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Salário",
    "valor": 3000,
    "tipo": "receita",
    "categoria": "Educação",
    "consumoConsciente": true
  }'

# Despesa consciente (essencial)
curl -X POST http://localhost:3000/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Supermercado",
    "valor": 200,
    "tipo": "despesa",
    "categoria": "Alimentação",
    "consumoConsciente": true
  }'

# Despesa por impulso
curl -X POST http://localhost:3000/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Compra impulsiva no shopping",
    "valor": 150,
    "tipo": "despesa",
    "categoria": "Lazer",
    "consumoConsciente": false
  }'
```

---

### 2. GET /transacoes - Obter Histórico e Métricas

**Descrição**: Retorna o histórico completo de transações e as métricas consolidadas processadas pelo backend.

**URL**: `GET http://localhost:3000/transacoes`

**Headers**:
```
Content-Type: application/json
```

**Response (200 OK)**:
```json
{
  "historico": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "descricao": "Salário",
      "valor": 3000,
      "tipo": "receita",
      "categoria": "Educação",
      "consumoConsciente": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "descricao": "Supermercado",
      "valor": 200,
      "tipo": "despesa",
      "categoria": "Alimentação",
      "consumoConsciente": true,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "descricao": "Compra impulsiva no shopping",
      "valor": 150,
      "tipo": "despesa",
      "categoria": "Lazer",
      "consumoConsciente": false,
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ],
  "metricas": {
    "saldoTotal": 2650,
    "totalDespesas": 350,
    "totalGastoImpulso": 150
  }
}
```

### Explicação das Métricas:

| Métrica | Descrição | Cálculo |
|---------|-----------|---------|
| `saldoTotal` | Saldo final da conta | Soma das receitas - Soma das despesas |
| `totalDespesas` | Total de todas as despesas | Soma de todas as transações com tipo "despesa" |
| `totalGastoImpulso` | Total de gastos por impulso | Soma das despesas onde `consumoConsciente` = false |

**Exemplo de Cálculo**:
- Receitas: 3000
- Despesas: 350 (200 consciente + 150 por impulso)
- **saldoTotal**: 3000 - 350 = 2650
- **totalDespesas**: 200 + 150 = 350
- **totalGastoImpulso**: 150

**Exemplo de Uso**:

```bash
curl http://localhost:3000/transacoes
```

---

## Executando a Aplicação

### Desenvolvimento:
```bash
npm run start:dev
```

### Produção:
```bash
npm run build
npm run start:prod
```

---

## ODS 12 - Consumo e Produção Sustentáveis

O campo `consumoConsciente` apoia o **Objetivo de Desenvolvimento Sustentável (ODS) 12**, que trata do consumo e produção sustentáveis. Ao marcar uma despesa como consciente ou por impulso, o usuário reflete sobre:

- **Consumo Consciente**: Gastos essenciais e planejados
- **Consumo por Impulso**: Gastos desnecessários e impulsivos

A métrica `totalGastoImpulso` ajuda o usuário a visualizar o peso dos gastos não essenciais e a tomar decisões mais sustentáveis.

---

## Tratamento de Erros

A API retorna mensagens de erro descritivas quando há validação:

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "Validation failed"
}
```

---

## Estrutura do Projeto

```
src/
├── transacoes/
│   ├── transacoes.controller.ts    # Rotas HTTP
│   ├── transacoes.service.ts       # Lógica de negócio e cálculo de métricas
│   ├── transacoes.model.ts         # Schema e Interface
│   ├── transacoes.module.ts        # Módulo
│   ├── transacoes.service.spec.ts  # Testes unitários
│   └── transacoes.controller.spec.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

---

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM (Object Data Modeling) para MongoDB
- **TypeScript**: Tipagem estática
