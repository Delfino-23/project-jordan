# Etapa 1 — Builder
FROM node:18-alpine AS builder

# Diretório da aplicação dentro do container
WORKDIR /app

# Copia apenas os manifests
COPY package.json package-lock.json ./

# Instala dependências
RUN npm install

# Copia todo o código da aplicação
COPY . .

# Compila o TypeScript
RUN npm run build


# Etapa 2 — Runner
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos necessários da etapa de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copia o banco
COPY banco.db ./banco.db

# Porta exposta (caso sua API seja 3000)
EXPOSE 3000

# Comando final para rodar versão buildada
CMD ["node", "dist/main.js"]
