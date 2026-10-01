# 🇧🇷 Reconheça Brasil Web

> **Seu negócio valorizado em todos os lugares.**

O **Reconheça Brasil Web** é uma plataforma web desenvolvida para valorizar e dar visibilidade a **negócios locais, projetos sociais, serviços, talentos e iniciativas brasileiras**.

O projeto foi estruturado como uma aplicação **full stack**, com front-end responsivo, API REST, microsserviço de notificações, banco de dados relacional, containerização e proxy reverso.

A solução foi pensada com uma arquitetura que permite **evolução, personalização e expansão comercial**, podendo ser adaptada para diferentes nichos, regiões, cidades, organizações ou modelos de negócio.

---

## 🚀 Visão do Produto

O Reconheça Brasil Web pode funcionar como uma base tecnológica para uma plataforma de divulgação e descoberta de iniciativas brasileiras.

A arquitetura permite evoluir o projeto para diferentes modelos, como:

- 📍 Diretório de negócios e serviços
- 🏪 Plataforma de divulgação de empresas locais
- 🤝 Rede de projetos sociais
- 🎨 Catálogo de profissionais e talentos
- 🏙️ Plataforma regional ou municipal
- 🌎 Expansão para diferentes regiões e países
- 💼 Plataforma B2B para empresas e parceiros
- 📢 Espaço para campanhas e divulgação
- 🔎 Busca e descoberta de serviços
- 📱 Experiência responsiva para dispositivos móveis

O projeto pode ser personalizado conforme o modelo de negócio e a estratégia do novo proprietário.

---

# 💻 Principais recursos

### Front-end

O projeto possui páginas estruturadas para apresentar a plataforma e seus conteúdos:

- Página inicial
- Sobre
- Serviços
- Projetos
- Contato

O front-end utiliza:

- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- `fetch()` para comunicação com a API REST
- Layout responsivo

Os projetos e serviços podem ser carregados dinamicamente através da API.

---

### 🔌 API REST

O backend principal foi desenvolvido em **Node.js com Express**.

Endpoints disponíveis:

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/projetos` | Lista projetos |
| `GET` | `/api/projetos/:id` | Consulta um projeto específico |
| `GET` | `/api/servicos` | Lista serviços e seus itens |
| `POST` | `/api/contato` | Registra contatos |
| `GET` | `/api/health` | Health check da API |

A API foi estruturada para permitir futuras expansões e integração com outros sistemas.

---

# 🐍 Microsserviço de notificações

O projeto possui um microsserviço independente desenvolvido com:

**Python + FastAPI**

Sua responsabilidade é processar as notificações relacionadas aos formulários de contato.

O fluxo é:

```text
Usuário
   ↓
Front-end
   ↓
API Node.js
   ↓
MySQL
   ↓
Microsserviço Python / FastAPI
   ↓
Notificação por e-mail
```

Quando as credenciais SMTP não estão configuradas, o serviço funciona em **modo simulado**, registrando as notificações nos logs do container.

Isso permite executar e demonstrar o projeto sem depender de uma conta de e-mail real.

---

# 🗄️ Banco de dados

O projeto utiliza **MySQL**.

O banco possui estruturas para armazenar:

- Projetos
- Serviços
- Itens de serviços
- Contatos

Estrutura inicial:

```text
mysql/
└── init.sql
```

O script de inicialização já contém a estrutura necessária para executar o projeto.

---

# 🐳 Docker

Toda a aplicação pode ser executada através de **Docker Compose**.

A arquitetura utiliza containers independentes para os principais componentes:

```text
                    ┌──────────────────────┐
                    │       NGINX          │
                    │      Porta 8080      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │  Front-end      │        │   Backend Node  │
        │ HTML/Bootstrap  │        │ Express / API   │
        └─────────────────┘        └────────┬────────┘
                                             │
                              ┌──────────────┴──────────────┐
                              │                             │
                              ▼                             ▼
                       ┌────────────┐              ┌─────────────────┐
                       │   MySQL    │              │ Backend Python  │
                       │ Database   │              │ FastAPI         │
                       └────────────┘              └─────────────────┘
```

O **Nginx** atua como ponto de entrada da aplicação, servindo o front-end e encaminhando as requisições `/api` para o backend Node.js.

---

# 🌐 Nginx

Configuração localizada em:

```text
nginx/default.conf
```

Responsabilidades:

- Servir arquivos estáticos
- Disponibilizar o front-end
- Encaminhar `/api/*`
- Centralizar o acesso à aplicação
- Permitir uma arquitetura preparada para HTTPS

---

# 🧩 Stack tecnológica

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura do front-end |
| CSS3 | Estilização |
| Bootstrap 5 | Interface responsiva |
| JavaScript | Interações e integração com API |
| Node.js | Backend |
| Express | API REST |
| Python | Microsserviço |
| FastAPI | API de notificações |
| MySQL | Banco de dados |
| Nginx | Proxy reverso e servidor web |
| Docker | Containerização |
| Docker Compose | Orquestração |

---

# ▶️ Como executar com Docker

## Pré-requisitos

Instale:

- [Docker](https://www.docker.com/)
- Docker Compose

## 1. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure as variáveis necessárias no arquivo `.env`.

## 2. Inicie a aplicação

```bash
docker compose up --build
```

## 3. Acesse

```text
http://localhost:8080
```

---

# 📦 Serviços

| Serviço | URL interna | Acesso |
|---|---|---|
| Nginx | `http://nginx:80` | `http://localhost:8080` |
| Node.js | `http://backend-node:3000` | Via `/api` |
| Python | `http://backend-python:8000` | Interno |
| MySQL | `mysql:3306` | Interno |

Para encerrar:

```bash
docker compose down
```

Para remover também os volumes do banco:

```bash
docker compose down -v
```

> **Atenção:** remover o volume do MySQL também remove os dados armazenados nesse volume.

---

# 🛠️ Desenvolvimento sem Docker

## MySQL

Crie um banco local e execute:

```text
mysql/init.sql
```

## Backend Node.js

```bash
cd backend-node

npm install

npm run dev
```

Configure as variáveis de ambiente necessárias, incluindo:

```text
DB_HOST=localhost
```

## Backend Python

```bash
cd backend-python

python -m venv .venv
```

No Linux/macOS:

```bash
source .venv/bin/activate
```

No Windows:

```bash
.venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute:

```bash
uvicorn main:app --reload --port 8000
```

## Front-end

O front-end é estático e pode ser executado através de um servidor local.

Exemplo:

```bash
npx serve frontend
```

Caso o Nginx não esteja sendo utilizado, configure o endereço da API em:

```text
frontend/js/main.js
```

---

# 🔐 Variáveis de ambiente

As configurações estão disponíveis em:

```text
.env.example
```

Entre as principais configurações estão:

### Banco de dados

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

### SMTP

```text
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
```

As configurações SMTP são opcionais.

Sem SMTP configurado, o sistema utiliza o modo simulado de notificações.

> **Importante:** credenciais reais, senhas, tokens e chaves privadas não devem ser versionados no Git.

---

# 📈 Potencial de expansão

A arquitetura atual fornece uma base para novas funcionalidades.

Possíveis evoluções incluem:

### 🔎 Busca

Implementação de:

- Busca por nome
- Categorias
- Localização
- Cidade
- Estado
- Segmento
- Serviços

### 👤 Cadastro de usuários

Possibilidade de adicionar:

- Login
- Cadastro
- Perfil
- Recuperação de senha
- Controle de acesso

### 🏢 Área administrativa

Um painel administrativo pode permitir:

- Criar projetos
- Editar projetos
- Excluir projetos
- Gerenciar serviços
- Gerenciar contatos
- Administrar usuários
- Gerenciar categorias

### 📍 Geolocalização

Possibilidade de integração com:

- Mapas
- Geolocalização
- Endereços
- Pontos de interesse
- Busca por proximidade

### 📱 Aplicação mobile

A arquitetura também pode servir como backend para futuras aplicações mobile.

### 🔔 Comunicação

Possíveis integrações:

- E-mail
- WhatsApp
- Notificações
- Formulários
- CRM

### 🌎 Internacionalização

A plataforma pode ser adaptada para múltiplos idiomas, mercados e regiões.

---

# 💼 Oportunidade comercial

O **Reconheça Brasil Web** pode ser adquirido como uma base tecnológica para desenvolvimento de um produto próprio.

O comprador pode:

- Personalizar identidade visual
- Alterar domínio e marca
- Adaptar categorias
- Modificar o modelo de negócio
- Criar novos módulos
- Integrar serviços externos
- Criar planos comerciais
- Implementar monetização
- Expandir para diferentes regiões
- Desenvolver uma área administrativa
- Transformar a plataforma em um produto SaaS

A arquitetura modular facilita a evolução da aplicação sem depender de uma única estrutura de página.

---

# 💰 Possibilidades de monetização

Dependendo da estratégia adotada pelo novo proprietário, o projeto pode ser desenvolvido para trabalhar com modelos como:

- Assinaturas
- Planos para empresas
- Destaques patrocinados
- Anúncios
- Listagens premium
- Publicidade local
- Leads
- Parcerias comerciais
- Serviços B2B
- White-label
- Licenciamento da plataforma

Essas funcionalidades **não representam necessariamente recursos já implementados**; são possibilidades de evolução comercial sobre a arquitetura existente.

---

# 🚀 Próximas evoluções recomendadas

Para transformar o projeto em uma plataforma pronta para operação comercial em produção, algumas evoluções recomendadas são:

1. Implementar HTTPS.
2. Configurar domínio próprio.
3. Substituir dados de demonstração por dados reais.
4. Criar painel administrativo.
5. Implementar autenticação e autorização.
6. Implementar validações e proteção adicional da API.
7. Configurar SMTP real.
8. Implementar backup do banco de dados.
9. Adicionar testes automatizados.
10. Melhorar observabilidade e logs.
11. Implementar mecanismos de busca e filtros.
12. Adicionar SEO avançado.
13. Implementar analytics.
14. Otimizar imagens e performance.
15. Preparar infraestrutura de produção.

---

# 📁 Estrutura principal

```text
Reconheca-Brasil-Web/
│
├── frontend/
│   ├── index.html
│   ├── sobre.html
│   ├── servicos.html
│   ├── projetos.html
│   ├── contato.html
│   ├── css/
│   ├── js/
│   └── img/
│
├── backend-node/
│   ├── package.json
│   └── ...
│
├── backend-python/
│   ├── requirements.txt
│   └── ...
│
├── mysql/
│   └── init.sql
│
├── nginx/
│   └── default.conf
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 🌐 Projeto

**Reconheça Brasil Web**

> Seu negócio valorizado em todos os lugares.

Projeto desenvolvido como uma solução web full stack com arquitetura modular e preparada para evolução.

---

# 📌 Status do projeto

**Status:** Projeto funcional / base tecnológica para comercialização e evolução.

O projeto está disponível para avaliação e aquisição, sujeito às condições definidas pelo proprietário.

---

# 👩‍💻 Autoria

**Janine Cunha**

Projeto **Reconheça Brasil Web**

© 2026 Janine Cunha. Todos os direitos reservados.

---
# 📌 Status do projeto

**Status:** 🟢 Projeto funcional — disponível para aquisição comercial.

O **Reconheça Brasil Web** está disponível para **venda e aquisição por comprador interessado em assumir o projeto e dar continuidade ao seu desenvolvimento, operação ou exploração comercial**.

A negociação poderá contemplar, conforme definido formalmente entre as partes:

- código-fonte do projeto;
- front-end;
- backend;
- API REST;
- microsserviço Python/FastAPI;
- estrutura do banco de dados;
- arquivos de configuração e infraestrutura;
- documentação técnica;
- direito de modificar e evoluir o projeto;
- direito de utilizar e explorar comercialmente os materiais de autoria da proprietária incluídos na negociação;
- transferência dos direitos patrimoniais de autor sobre os materiais de autoria da proprietária que forem expressamente incluídos no contrato;
- eventual exclusividade sobre o projeto, quando expressamente estabelecida no contrato.

A aquisição **não inclui automaticamente direitos de propriedade sobre tecnologias, bibliotecas, frameworks, serviços ou outros componentes de terceiros utilizados pelo projeto**, que permanecem sujeitos às respectivas licenças e termos de uso.

---

# 👩‍💻 Autoria

**Janine Cunha**

**Projeto:** Reconheça Brasil Web

© 2026 Janine Cunha. Todos os direitos reservados.

---

# 🔒 Direitos autorais e propriedade

**PROJETO PROPRIETÁRIO — TODOS OS DIREITOS RESERVADOS**

O **Reconheça Brasil Web** é um projeto proprietário de autoria de **Janine Cunha** e está sendo disponibilizado para **avaliação e aquisição comercial**.

O acesso ao código-fonte, ao repositório ou à demonstração do projeto **não concede ao visitante qualquer licença ou autorização para copiar, reproduzir, modificar, distribuir, sublicenciar, revender ou explorar comercialmente o projeto**, salvo mediante autorização expressa da proprietária ou contrato celebrado entre as partes.

Nenhuma transferência de propriedade intelectual ocorre pelo simples acesso, visualização, download ou cópia do repositório.

A eventual transferência de direitos será realizada exclusivamente mediante **acordo escrito**, especificando os ativos, direitos e condições incluídos na negociação.

---

# 🤝 Aquisição comercial

O projeto está disponível para negociação com pessoas, empresas, investidores ou organizações interessadas em adquirir e desenvolver a solução.

Dependendo dos termos negociados, a aquisição poderá envolver a transferência dos direitos patrimoniais sobre os materiais de autoria da proprietária incluídos no negócio, bem como direitos de utilização, modificação, desenvolvimento e exploração comercial.

**Qualquer condição de exclusividade deverá ser expressamente estabelecida no contrato de aquisição.**

Para informações sobre:

- 💼 aquisição do projeto;
- 🤝 negociação comercial;
- 💻 código-fonte;
- 🔄 transferência de direitos;
- 🚀 continuidade do desenvolvimento;
- 🎨 personalização;
- 🌎 expansão da plataforma;

entre em contato através dos canais disponibilizados pela proprietária.

---

# ⚖️ Componentes de terceiros

O projeto utiliza tecnologias, bibliotecas, frameworks e ferramentas de terceiros.

Esses componentes **não são propriedade da autora do Reconheça Brasil Web** e continuam sujeitos às suas respectivas licenças e termos de uso.

Entre as tecnologias utilizadas estão:

- HTML5
- CSS3
- Bootstrap
- JavaScript
- Node.js
- Express
- Python
- FastAPI
- MySQL
- Nginx
- Docker
- Docker Compose

A eventual aquisição do Reconheça Brasil Web refere-se aos **materiais e direitos que possam ser legalmente transferidos pela proprietária**, não implicando transferência de propriedade sobre tecnologias de terceiros.

---

# 📬 Contato

Para informações sobre **aquisição, negociação, transferência de direitos, parceria ou continuidade do projeto**, entre em contato através dos canais disponibilizados pela proprietária.

**Reconheça Brasil Web**  
> *Seu negócio valorizado em todos os lugares.*

© 2026 Janine Cunha. Todos os direitos reservados.
