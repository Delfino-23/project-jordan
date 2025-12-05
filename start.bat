@echo off
REM Quick Start Script para Windows

echo.
echo 🚀 Project Jordan - Quick Start
echo ================================
echo.

REM 1. Install dependencies
echo 📦 Instalando dependências...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências
    exit /b 1
)
echo ✅ Dependências instaladas
echo.

REM 2. Build
echo 🔨 Compilando TypeScript...
call npm run build
if errorlevel 1 (
    echo ❌ Erro ao compilar
    exit /b 1
)
echo ✅ Compilado com sucesso
echo.

REM 3. Tests
echo 🧪 Executando testes...
call npm test
if errorlevel 1 (
    echo ❌ Erro nos testes
    exit /b 1
)
echo ✅ Testes passaram
echo.

REM 4. Start server
echo 🎯 Iniciando servidor...
call npm start
echo.
echo ✅ Servidor rodando em http://localhost:3000
