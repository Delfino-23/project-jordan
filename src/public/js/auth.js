/**
 * Funções auxiliares para gerenciar JWT no navegador
 */

// Armazenar token após login
function salvarToken(token) {
  localStorage.setItem('authToken', token);
}

// Recuperar token armazenado
function obterToken() {
  return localStorage.getItem('authToken');
}

// Remover token (logout)
function removerToken() {
  localStorage.removeItem('authToken');
}

// Fazer requisição com token
async function requisicaoAutenticada(url, opcoes = {}) {
  const token = obterToken();
  
  if (!token) {
    console.error('Token não encontrado. Faça login primeiro.');
    return null;
  }

  const headers = {
    ...opcoes.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const resposta = await fetch(url, {
      ...opcoes,
      headers
    });

    if (resposta.status === 401) {
      console.error('Token expirado. Faça login novamente.');
      removerToken();
      window.location.href = '/login';
      return null;
    }

    return await resposta.json();
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    return null;
  }
}

// Exemplo de uso: Login
async function fazerLogin(email, senha) {
  try {
    const resposta = await fetch('/login/validar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      salvarToken(dados.token);
      console.log('Login realizado com sucesso!');
      console.log('Usuário:', dados.usuario);
      return dados;
    } else {
      console.error('Erro ao fazer login:', dados.error);
      return null;
    }
  } catch (erro) {
    console.error('Erro na requisição de login:', erro);
    return null;
  }
}

// Exemplo de uso: Acessar rota protegida
async function obterPerfil() {
  const dados = await requisicaoAutenticada('/perfil');
  
  if (dados) {
    console.log('Dados do perfil:', dados.usuario);
  }
}

// Exemplo de uso: Logout
function fazerLogout() {
  removerToken();
  console.log('Desconectado com sucesso');
  window.location.href = '/login';
}
