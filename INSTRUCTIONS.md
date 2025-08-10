# Instruções para Rodar o Projeto - Etapa 3

## 1. Configurar e Subir o Banco PostgreSQL com Docker

* Certifique-se de ter o [Docker](https://docs.docker.com/get-docker/) instalado e rodando no seu sistema.
* Na raiz do projeto, você deve ter o arquivo `docker-compose.yml` configurado para subir o container do PostgreSQL.

Para iniciar o container com volume persistente:

```bash
docker compose up -d
```

Para parar o container e remover volumes (dados):

```bash
docker compose down -v
```

---

## 2. Configurar Variáveis de Ambiente

* Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (não altere os valores, pois são usados nos testes):

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
NODE_ENV=development
```

---

## 3. Instalar Dependências do Projeto

Na raiz do projeto, rode:

```bash
npm install
```

---

## 4. Executar Migrations

Para criar as tabelas no banco PostgreSQL:

```bash
npx knex migrate:latest
```

---

## 5. Executar Seeds

Para popular o banco com dados iniciais (2 agentes e 2 casos):

```bash
npx knex seed:run
```

---

## 6. Rodar a API

Para iniciar o servidor da API:

```bash
npm start
```

ou, se usar `nodemon` para desenvolvimento:

```bash
npm run dev
```

---

## 7. Scripts Úteis (Bônus)

* Resetar banco (drop + migrate + seed):

```bash
npm run db:reset
```

---

## Observações

* O banco PostgreSQL está configurado para rodar na porta padrão 5432.
* O Knex usa as variáveis do arquivo `.env` para se conectar ao banco.
* Não modifique o arquivo `.env` com outras credenciais para evitar erros de conexão e falha nos testes.
* Use o endpoint `/agentes/:id/casos` para listar casos de um agente específico.