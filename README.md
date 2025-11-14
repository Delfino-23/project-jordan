# Project Jordan - Sistema de Gestão de Alunos

Bem-vindo ao **Project Jordan**, uma aplicação web desenvolvida em Node.js com Express que implementa um sistema de gestão de alunos com autenticação segura de usuários.

## 📋 Visão Geral

O Project Jordan é uma plataforma que permite:
- Registro e autenticação de usuários com criptografia de senhas
- Gestão de dados de alunos
- Interface web responsiva com EJS e Bootstrap
- Banco de dados SQLite com ORM Sequelize
- JWT (JSON Web Tokens) para autenticação

---

## 🏗️ Estrutura do Projeto

```
project-jordan/
├── config/                    # Configurações da aplicação
│   ├── config.json           # Configuração do banco de dados
│   └── database.js           # Inicialização do Sequelize
│
├── controllers/              # Lógica de negócio
│   ├── UsuarioControllers.js # Controlador de usuários (login, registro)
│   └── AlunoControllers.js   # Controlador de alunos
│
├── models/                   # Definição de modelos de dados
│   ├── Usuario.js            # Modelo de usuário
│   └── Alunos.js             # Modelo de alunos
│
├── routes/                   # Rotas da aplicação
│   ├── home.js               # Rotas da página inicial
│   ├── login.js              # Rotas de autenticação
│   └── register.js           # Rotas de registro de usuários
│
├── views/                    # Templates EJS (interface web)
│   ├── index.ejs             # Página inicial
│   ├── login.ejs             # Página de login
│   ├── register.ejs          # Página de registro
│   └── partials/             # Componentes reutilizáveis
│       ├── header.ejs        # Cabeçalho da página
│       ├── navbar.ejs        # Barra de navegação
│       └── footer.ejs        # Rodapé da página
│
├── public/                   # Arquivos estáticos (front-end)
│   ├── css/                  # Estilos CSS
│   │   ├── global.css        # Estilos globais
│   │   ├── home.css          # Estilos da página inicial
│   │   └── login.css         # Estilos de login
│   ├── js/                   # Scripts JavaScript
│   │   ├── home.js           # Scripts da página inicial
│   │   ├── login.js          # Scripts de login
│   │   └── register.js       # Scripts de registro
│   ├── img/                  # Imagens e ícones
│   └── video/                # Vídeos (se houver)
│
├── server.js                 # Entrada principal da aplicação
├── package.json              # Dependências do projeto
└── README.md                 # Este arquivo

```

---

## 🔧 Componentes Principais

### 1. **Server (server.js)**

O arquivo principal que inicia a aplicação Express.

**Responsabilidades:**
- Configurar middleware (body-parser, express.static)
- Conectar rotas da aplicação
- Sincronizar banco de dados
- Iniciar o servidor na porta 3000 (ou PORT do ambiente)

```javascript
const PORT = process.env.PORT || 3000;
```

### 2. **Configuração de Banco de Dados (config/database.js)**

Utiliza **Sequelize** para gerenciar a conexão com o SQLite.

- Lê configurações do arquivo `config/config.json`
- Estabelece conexão com o banco de dados
- Sincroniza modelos com as tabelas

### 3. **Modelos (models/)**

Define a estrutura das entidades do sistema:

#### **Usuario.js**
Representa usuários do sistema que podem fazer login:
- `nome`: Nome do usuário
- `email`: Email único (identificador)
- `senha`: Senha criptografada com bcryptjs
- `createdAt`, `updatedAt`: Timestamps automáticos

#### **Alunos.js**
Representa dados dos alunos:
- `nome`: Nome completo do aluno
- `email`: Email do aluno
- `tel`: Telefone para contato
- `cpf`: CPF (identificador único)
- `createdAt`, `updatedAt`: Timestamps automáticos

### 4. **Controladores (controllers/)**

Contêm a lógica de negócio da aplicação:

#### **UsuarioControllers.js**

**`criarUsuario()`**
- Registra novo usuário
- Valida campos obrigatórios
- Criptografa senha com bcryptjs (10 rounds)
- Verifica se email já existe
- Retorna JSON com dados do usuário criado

**`validarUsuario()`**
- Autentica usuário no login
- Valida credenciais
- Compara senha com hash armazenado
- Retorna dados do usuário autenticado

#### **AlunoControllers.js**
Controlador para operações com alunos (CRUD).

### 5. **Rotas (routes/)**

#### **login.js**
- GET `/login` - Exibe página de login
- POST `/login` - Processa autenticação

#### **register.js**
- GET `/register` - Exibe página de registro
- POST `/register` - Processa criação de novo usuário

#### **home.js**
- GET `/` - Exibe página inicial
- GET `/home` - Página home autenticada

### 6. **Views (views/)**

Templates EJS para renderizar HTML dinâmico:

- **index.ejs** - Página inicial
- **login.ejs** - Formulário de login
- **register.ejs** - Formulário de registro
- **Partials/** - Componentes reutilizáveis (header, navbar, footer)

### 7. **Arquivos Estáticos (public/)**

#### CSS
- `global.css` - Estilos aplicados globalmente
- `home.css` - Estilos específicos da página inicial
- `login.css` - Estilos de formulários de autenticação

#### JavaScript
- `home.js` - Lógica front-end da página inicial
- `login.js` - Validação/interatividade do login
- `register.js` - Validação/interatividade do registro

---

## 📦 Dependências

### Produção
| Pacote | Versão | Descrição |
|--------|--------|-----------|
| **express** | ^5.1.0 | Framework web para Node.js |
| **ejs** | ^3.1.10 | Template engine para renderizar views |
| **sequelize** | ^6.37.7 | ORM para gerenciar banco de dados |
| **sqlite3** | ^5.1.7 | Driver SQLite |
| **bcryptjs** | ^3.0.2 | Criptografia de senhas |
| **jsonwebtoken** | ^9.0.2 | Geração e validação de JWT |
| **body-parser** | ^2.2.0 | Parser de requisições HTTP |

### Desenvolvimento
| Pacote | Versão | Descrição |
|--------|--------|-----------|
| **nodemon** | ^3.1.11 | Reinicia servidor automaticamente ao salvar arquivos |

---

## 🔐 Segurança

### Criptografia de Senhas
- Utiliza **bcryptjs** com 10 rounds de salt
- Senhas nunca são armazenadas em texto plano
- Comparação segura durante autenticação

### JWT (JSON Web Tokens)
- Implementado para autenticação stateless
- Tokens para manter sessão do usuário

### Validação
- Verificação de campos obrigatórios
- Verificação de email duplicado no registro
- Tratamento de erros com status HTTP apropriados

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repositorio>
cd project-jordan

# Instale dependências
npm install
```

### Configuração do Banco de Dados

Edite `config/config.json` com suas configurações:

```json
{
  "development": {
    "dialect": "sqlite",
    "storage": "./database.sqlite"
  }
}
```

### Iniciar a Aplicação

```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npx nodemon server.js
```

A aplicação estará disponível em `http://localhost:3000`

---

## 📊 Fluxo de Autenticação

```
1. Usuário acessa /register
2. Preenche nome, email e senha
3. Senha é criptografada com bcryptjs
4. Dados salvos no banco de dados
5. Usuário pode fazer login em /login
6. Email e senha são validados
7. JWT é gerado e armazenado
8. Acesso à área autenticada
```

---

## 🔄 Fluxo de Dados

```
Frontend (EJS/JS)
    ↓
    Routes (Express)
    ↓
    Controllers (Lógica de negócio)
    ↓
    Models (Sequelize)
    ↓
    Database (SQLite)
```

---

## 📝 Variáveis de Ambiente

```bash
PORT=3000          # Porta do servidor (padrão: 3000)
NODE_ENV=development  # Ambiente de execução
```

---

## 🐛 Tratamento de Erros

A aplicação retorna respostas JSON estruturadas:

### Sucesso (200)
```json
{
  "message": "Login realizado com sucesso!",
  "usuario": {
    "nome": "João",
    "email": "joao@example.com"
  }
}
```

### Erro (4xx/5xx)
```json
{
  "error": "Email ou senha incorreto!"
}
```

---

## 📞 Contato e Suporte

**Projeto:** Project Jordan  
**Instituição:** FATEC  
**Período:** Quarto semestre  
**Propósito:** Trabalho de Projeto Supervisionado (PS)

---

## 📄 Licença

Este projeto está sob a licença ISC.

---

## ✅ Checklist de Funcionalidades

- [x] Registro de usuários
- [x] Login com autenticação
- [x] Criptografia de senhas
- [x] Modelo de alunos
- [x] Interface web com EJS
- [x] Banco de dados SQLite
- [ ] CRUD completo de alunos
- [ ] Sistema de permissões (admin/aluno)
- [ ] Recuperação de senha
- [ ] Validação de email

---

**Última atualização:** 14 de novembro de 2025
