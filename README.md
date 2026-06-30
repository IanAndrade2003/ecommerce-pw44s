# MyDrugs

E-commerce baseado na série "How to sell drugs online (fast)".
Backend em **Spring Boot** (Java 21) + Frontend em **React + Vite**.

## Pré-requisitos (instalar na máquina)

- **Java 21 (JDK)** — ex.: [Eclipse Temurin 21](https://adoptium.net/)
  - Defina a variável de ambiente `JAVA_HOME` apontando para a pasta do JDK.
- **Node.js 20+** — https://nodejs.org

> Não precisa instalar o Maven: o projeto usa o **Maven Wrapper** (`mvnw`), que baixa o Maven automaticamente na primeira execução.

## Como rodar

### 1) Backend (API) — porta 8084

Na raiz do projeto:

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

- Banco de dados: **H2 em memória** (não precisa instalar nada; os dados de exemplo são recriados a cada início via `src/main/resources/import.sql`).
- Console do H2: http://localhost:8084/h2-console (JDBC URL: `jdbc:h2:mem:testdb`)

### 2) Frontend — porta 5173

Em outro terminal:

```bash
cd client
npm install        # só na primeira vez
npm run dev
```

Acesse: http://localhost:5173

## Usuário de teste

Crie uma conta na tela de cadastro. A senha precisa ter **6 a 20 caracteres**, com pelo menos uma **letra maiúscula**, uma **minúscula** e um **número** (ex.: `Senha123`).

## Observações

- O frontend espera o backend em `http://localhost:8084` (configurado em `client/src/lib/axios.ts`).
- Para compactar e enviar o projeto, a pasta `client/node_modules` (grande) e a pasta `target/` podem ser excluídas do zip — elas são recriadas com `npm install` e `mvnw`.
