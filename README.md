# 💈 BarberApp API

<div align="center">
  <img src="https://res.cloudinary.com/dmhyzqdp9/image/upload/v1744490361/Gemini_Generated_Image_ezsmgrezsmgrezsm_vxtpif.jpg" alt="Logo BarberApp API" width="240px" height="240px" />
  
  <p align="center">
    <strong>API RESTful para gerenciamento de barbearias</strong>
  </p>
  
  <p align="center">
    <a href="#visão-geral">Visão Geral</a>
    ·
    <a href="#funcionalidades">Funcionalidades</a>
    ·
    <a href="#instalação">Instalação</a>
    ·
    <a href="#endpoints">Endpoints</a>
    ·
    <a href="#tecnologias">Tecnologias</a>
    ·
    <a href="#estrutura-do-projeto">Estrutura</a>
  </p>
</div>

## 🌟 Visão Geral

BarberApp API é um backend completo desenvolvido com Node.js e Express para gerenciar serviços de barbearia. Oferece autenticação segura, gerenciamento de barbeiros, clientes, serviços e sistema de agendamento com validação de horários disponíveis.

## ✨ Funcionalidades

- 🔐 **Autenticação e Autorização**
  - Registro e login de usuários
  - Autenticação via JWT
  - Permissões de administrador

- 👨‍💼 **Gerenciamento de Barbeiros**
  - Cadastro de barbeiros com especialidades
  - Controle de horários de trabalho 
  - Disponibilidade por dia da semana

- 💇‍♂️ **Catálogo de Serviços**
  - Gerenciamento de serviços com preços e durações
  - Categorização de serviços
  - Ativação/desativação de serviços

- 📅 **Sistema de Agendamentos**
  - Verificação inteligente de horários disponíveis
  - Cálculo automático de duração e preço total
  - Status de agendamento (agendado, confirmado, cancelado, concluído)
  - Sistema de avaliação pós-atendimento

- 👥 **Gerenciamento de Clientes**
  - Perfis de clientes
  - Histórico de agendamentos
  - Atualizações de dados

- 📊 **Dashboard e Relatórios**
  - Estatísticas de agendamentos
  - Análise de faturamento
  - Métricas de desempenho

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seunome/barberapp-api.git
   cd barberapp-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` no diretório raiz e configure:
   ```
   MONGODB_URI=sua_uri_do_mongodb
   JWT_SECRET=seu_segredo_jwt
   PORT=3001
   ```

4. Inicie o servidor:
   ```bash
   # Modo desenvolvimento
   npm run dev
   
   # Modo produção
   npm start
   ```

## 🌐 Endpoints

### 🔑 Autenticação

```
POST /api/auth/register - Cadastro de usuário
POST /api/auth/login    - Login de usuário
```

### 👨‍💼 Barbeiros

```
GET    /api/barbeiros               - Lista todos os barbeiros
POST   /api/barbeiros               - Cria novo barbeiro
GET    /api/barbeiros/:id           - Obtém barbeiro específico
PATCH  /api/barbeiros/:id           - Atualiza barbeiro
DELETE /api/barbeiros/:id           - Remove barbeiro (desativa)
GET    /api/barbeiros/horarios-disponiveis - Verifica disponibilidade
```

### 💇‍♂️ Serviços

```
GET    /api/servicos      - Lista todos os serviços
POST   /api/servicos      - Cria novo serviço
GET    /api/servicos/:id  - Obtém serviço específico
PATCH  /api/servicos/:id  - Atualiza serviço
DELETE /api/servicos/:id  - Remove serviço
```

### 📅 Agendamentos

```
GET    /api/agendamentos            - Lista agendamentos (com filtros)
POST   /api/agendamentos            - Cria novo agendamento
GET    /api/agendamentos/:id        - Obtém agendamento específico
PATCH  /api/agendamentos/:id/status - Atualiza status do agendamento
PATCH  /api/agendamentos/:id/avaliacao - Adiciona avaliação
```

### 👥 Clientes

```
GET    /api/clientes      - Lista todos os clientes
POST   /api/clientes      - Cria novo cliente
GET    /api/clientes/:id  - Obtém cliente específico
PATCH  /api/clientes/:id  - Atualiza cliente
```

### 📊 Admin

```
GET    /api/admin/stats   - Estatísticas para dashboard
```

## 🛠️ Tecnologias

- **Backend**: Node.js, Express.js
- **Banco de Dados**: MongoDB, Mongoose
- **Autenticação**: JWT (jsonwebtoken), bcrypt
- **Desenvolvimento**: Nodemon, Jest, Supertest
- **Deployment**: Containerização com Docker (opcional)

## 🔍 Estrutura do Projeto

```
src/
├── controllers/    # Controladores para cada recurso
├── models/         # Modelos Mongoose
├── routes/         # Definição de rotas
├── middleware/     # Middlewares para autenticação e outros
├── app.js          # Configuração principal do Express
└── ...
```

## 📦 Modelos de Dados

### Cliente
- Nome, email, senha, telefone
- Foto de perfil
- Histórico de agendamentos
- Flag de administrador

### Barbeiro
- Nome, email, telefone
- Especialidades
- Foto de perfil
- Horário de trabalho (início, fim, dias disponíveis)
- Status ativo/inativo

### Serviço
- Nome, descrição
- Preço, duração
- Categoria
- Imagem
- Status ativo/inativo

### Agendamento
- Cliente, barbeiro
- Lista de serviços
- Data e horário
- Duração e preço total
- Status (agendado, confirmado, cancelado, concluído)
- Avaliação (nota, comentário)

## 🔒 Segurança e Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação:

1. O cliente faz login via endpoint `/auth/login`
2. O servidor valida as credenciais e retorna um token JWT
3. O cliente inclui o token no header `Authorization` das requisições
4. Rotas protegidas verificam a validade do token
5. Rotas administrativas verificam permissões adicionais

## 🧪 Testes

Execute os testes automatizados:

```bash
npm test
```

## 📝 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.

## 📞 Contato

RafaelBispoDev@outlook.com

Link do Projeto: [https://github.com/seunomeusuario/barberapp-api](https://github.com/seunomeusuario/barberapp-api)

---

<div align="center">
  <p>Desenvolvido com ❤️ por Rafael Bispo</p>
</div>
