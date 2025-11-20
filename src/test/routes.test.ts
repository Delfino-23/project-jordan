import request from 'supertest';
import express, { Express } from 'express';
import homeRoutes from '../routes/home.js';
import loginRoutes from '../routes/login.js';
import registerRoutes from '../routes/register.js';
import path from 'path';

// Mock dos controllers
jest.mock('../controllers/AlunoControllers.js', () => ({
  criarAluno: jest.fn((req, res) => {
    const { nome, email, tel, cpf } = req.body;

    if (!nome || !email || !tel || !cpf) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    return res.status(201).json({
      message: 'Aluno criado com sucesso!',
      aluno: { id: 1, nome, email, tel, cpf },
    });
  }),
}));

jest.mock('../controllers/UsuarioControllers.js', () => ({
  criarUsuario: jest.fn((req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    return res.status(201).json({
      message: 'Usuário criado com sucesso!',
      usuario: { id: 1, nome, email },
    });
  }),

  validarUsuario: jest.fn((req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    if (email === 'teste@email.com' && senha === 'senha123') {
      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        usuario: { nome: 'Teste', email },
      });
    }

    return res.status(401).json({ error: 'Email ou senha incorreto!' });
  }),
}));

describe('Testes de Rotas', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Configura EJS
    const viewsPath = path.join(__dirname, '../../src/views');
    const publicPath = path.join(__dirname, '../../src/public');
    
    app.set('view engine', 'ejs');
    app.set('views', viewsPath);
    app.use(express.static(publicPath));

    app.use('/', homeRoutes);
    app.use('/login', loginRoutes);
    app.use('/register', registerRoutes);
  });

  describe('Rotas Home', () => {
    test('GET / - Deve retornar a página inicial', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
    });

    test('POST /criarAluno - Deve criar um novo aluno com dados válidos', async () => {
      const response = await request(app)
        .post('/criarAluno')
        .send({
          nome: 'João Silva',
          email: 'joao@email.com',
          tel: '11999999999',
          cpf: '12345678910',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Aluno criado com sucesso!');
      expect(response.body.aluno).toHaveProperty('id');
      expect(response.body.aluno.nome).toBe('João Silva');
    });

    test('POST /criarAluno - Deve retornar erro ao não preencher campos obrigatórios', async () => {
      const response = await request(app)
        .post('/criarAluno')
        .send({
          nome: 'João Silva',
          // faltando email, tel e cpf
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Preencha todos os campos!');
    });

    test('POST /criarAluno - Deve retornar erro com body vazio', async () => {
      const response = await request(app).post('/criarAluno').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Preencha todos os campos!');
    });
  });

  describe('Rotas Login', () => {
    test('GET /login - Deve retornar a página de login', async () => {
      const response = await request(app).get('/login');

      expect(response.status).toBe(200);
    });

    test('POST /login/validar - Deve validar login com credenciais corretas', async () => {
      const response = await request(app)
        .post('/login/validar')
        .send({
          email: 'teste@email.com',
          senha: 'senha123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Login realizado com sucesso!');
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario.email).toBe('teste@email.com');
    });

    test('POST /login/validar - Deve retornar erro com email ou senha incorreto', async () => {
      const response = await request(app)
        .post('/login/validar')
        .send({
          email: 'teste@email.com',
          senha: 'senhaErrada',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Email ou senha incorreto!');
    });

    test('POST /login/validar - Deve retornar erro ao não preencher campos', async () => {
      const response = await request(app)
        .post('/login/validar')
        .send({
          email: 'teste@email.com',
          // faltando senha
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Preencha todos os campos!');
    });

    test('POST /login/validar - Deve retornar erro com body vazio', async () => {
      const response = await request(app).post('/login/validar').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Preencha todos os campos!');
    });
  });

  describe('Rotas Register', () => {
    test('GET /register - Deve retornar a página de registro', async () => {
      const response = await request(app).get('/register');

      expect(response.status).toBe(200);
    });

    test('POST /register/salvar - Deve criar um novo usuário com dados válidos', async () => {
      const response = await request(app)
        .post('/register/salvar')
        .send({
          nome: 'Maria Silva',
          email: 'maria@email.com',
          senha: 'senha123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Usuário criado com sucesso!');
      expect(response.body.usuario).toHaveProperty('id');
      expect(response.body.usuario.nome).toBe('Maria Silva');
      expect(response.body.usuario.email).toBe('maria@email.com');
    });

    test('POST /register/salvar - Deve retornar erro ao não preencher campos obrigatórios', async () => {
      const response = await request(app)
        .post('/register/salvar')
        .send({
          nome: 'Maria Silva',
          // faltando email e senha
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Preencha todos os campos!');
    });

    test('POST /register/salvar - Deve retornar erro com body vazio', async () => {
      const response = await request(app).post('/register/salvar').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Preencha todos os campos!');
    });
  });

  describe('Testes Gerais de Rotas', () => {
    test('GET /rota-inexistente - Deve retornar 404', async () => {
      const response = await request(app).get('/rota-inexistente');

      expect(response.status).toBe(404);
    });

    test('POST /rota-inexistente - Deve retornar 404', async () => {
      const response = await request(app).post('/rota-inexistente').send({});

      expect(response.status).toBe(404);
    });
  });
});
