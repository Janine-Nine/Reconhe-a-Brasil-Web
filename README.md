# Reconheça Brasil Web

Plataforma que valoriza negócios locais, projetos sociais e talentos de todo
o Brasil. Projeto full stack com front-end estático (HTML/Bootstrap), API em
**Node.js**, microsserviço de notificações em **Python (FastAPI)**, banco de
dados **MySQL** e orquestração via **Docker Compose**, atrás de um **Nginx**
que serve tudo em uma única porta.

## Arquitetura

```
                      ┌────────────────────┐
   navegador  ───────▶│       Nginx        │  (porta 8080)
                      │  serve o front-end │
                      │  e faz proxy /api  │
                      └─────────┬──────────┘
                                │
                     ┌──────────┴───────────┐
                     ▼                      ▼
            ┌─────────────────┐   ┌──────────────────┐
            │  backend-node    │   │  (arquivos        │
            │  (Express API)   │   │   estáticos)      │
            └────────┬─────────┘   └──────────────────┘
                     │
        ┌────────────┼───────────────┐
        ▼                            ▼
┌───────────────┐           ┌──────────────────────┐
│     MySQL      │           │   backend-python      │
│  (projetos,    │           │  (FastAPI — envia     │
│  serviços,     │◀──────────│  notificação de e-mail│
│  contatos)     │  grava    │  do formulário)       │
└───────────────┘  contato   └──────────────────────┘
```

- **Front-end** (`frontend/`): as 5 páginas (`index`, `sobre`, `servicos`,
  `projetos`, `contato`) em HTML + Bootstrap 5, com JS puro (`js/main.js`)
  que busca projetos e serviços na API e envia o formulário de contato via
  `fetch`.
- **backend-node** (`backend-node/`): API REST em Express que expõe
  `/api/projetos`, `/api/servicos` e `/api/contato`, conversando com o MySQL.
- **backend-python** (`backend-python/`): microsserviço FastAPI que recebe
  os dados do contato (via chamada interna do Node) e dispara o e-mail de
  notificação. Sem credenciais SMTP configuradas, ele roda em **modo
  simulado** (apenas registra em log), então o projeto funciona de ponta a
  ponta sem exigir uma conta de e-mail real.
- **MySQL** (`mysql/init.sql`): schema com as tabelas `projetos`, `servicos`,
  `servico_itens` e `contatos`, já populado com os dados de exemplo do site.
- **Nginx** (`nginx/default.conf`): serve os arquivos estáticos do front-end
  e faz proxy reverso de `/api/*` para o backend Node.

## Como rodar (com Docker)

Pré-requisitos: [Docker](https://www.docker.com/) e Docker Compose.

```bash
# 1. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 2. Suba todos os serviços
docker compose up --build

# 3. Acesse o site
# http://localhost:8080
```

Serviços disponíveis após subir:

| Serviço          | URL interna                | Exposto no host |
|------------------|-----------------------------|------------------|
| Site (Nginx)     | http://nginx:80             | http://localhost:8080 |
| API Node         | http://backend-node:3000    | (somente via Nginx, em `/api`) |
| Serviço Python   | http://backend-python:8000  | interno apenas |
| MySQL            | mysql:3306                  | http://localhost:3306 |

Para derrubar tudo: `docker compose down` (adicione `-v` para também apagar
os dados do MySQL).

## Rodando sem Docker (desenvolvimento local)

**MySQL**: crie um banco local e rode o script `mysql/init.sql`.

**Backend Node**
```bash
cd backend-node
npm install
# defina DB_HOST=localhost e demais variáveis, ou exporte-as no terminal
npm run dev
```

**Backend Python**
```bash
cd backend-python
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Front-end**: como é estático, basta abrir `frontend/index.html` em um
servidor local (ex.: `npx serve frontend`) — mas nesse caso configure o
Nginx ou ajuste `API_BASE` em `js/main.js` para apontar direto para
`http://localhost:3000/api`, já que sem o Nginx não há proxy de `/api`.

## Endpoints da API (via Nginx, prefixo `/api`)

| Método | Rota              | Descrição                                  |
|--------|-------------------|---------------------------------------------|
| GET    | `/api/projetos`   | Lista todos os projetos                     |
| GET    | `/api/projetos/:id` | Detalhe de um projeto                     |
| GET    | `/api/servicos`   | Lista os pacotes de serviço com seus itens  |
| POST   | `/api/contato`    | Registra um contato e dispara notificação   |
| GET    | `/api/health`     | Health check da API Node                    |

## Variáveis de ambiente (`.env`)

Veja `.env.example`. As principais são as credenciais do MySQL e, opcional,
as credenciais SMTP para envio real de e-mail (`SMTP_HOST`, `SMTP_USER`,
`SMTP_PASSWORD`, etc.). Sem SMTP configurado, as notificações apenas ficam
registradas no log do container `backend-python`.

## Próximos passos sugeridos

- Adicionar HTTPS (ex.: Traefik ou Certbot na frente do Nginx) para produção.
- Criar um painel administrativo simples para gerenciar projetos e serviços
  sem mexer direto no banco.
- Trocar as imagens de placeholder em `frontend/img/` pelas fotos reais dos
  projetos.
- Adicionar testes automatizados para as rotas da API Node e do serviço
  Python.
