# TechSolutio - Desafio Full Stack

Este projeto é uma aplicação Full Stack desenvolvida como resolução de um desafio técnico. A arquitetura implementa um sistema de mensageria assíncrona (Fila) para operações de escrita no banco de dados, garantindo escalabilidade e resiliência.

## 🏗️ Arquitetura e Stack Tecnológica

* **Frontend:** Angular (v17+), Tailwind CSS, RxJS.
* **Backend:** Python 3, Flask, Flask-SQLAlchemy, Flask-JWT-Extended.
* **Mensageria (Fila):** Redis.
* **Processamento Assíncrono:** Worker Python customizado.
* **Banco de Dados:** PostgreSQL.
* **Infraestrutura:** Docker e Docker Compose.

---

## ⚙️ Pré-requisitos

Para rodar este projeto localmente, você precisará de:
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* [Python 3.10+](https://www.python.org/) instalado.
* [Node.js](https://nodejs.org/) (v18+) e NPM instalados.
* [Angular CLI](https://angular.dev/tools/cli) instalado globalmente (`npm install -g @angular/cli`).

---

## 🔐 Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz da pasta `/backend` com as seguintes variáveis:

```env
# Configurações do Banco de Dados PostgreSQL
DATABASE_URL=postgresql://admin:admin123@localhost:5432/techsolutio_db

# Configurações do Redis
REDIS_URL=redis://localhost:6379/0

# Configuração do JWT (Autenticação)
JWT_SECRET_KEY=sua_chave_secreta_super_segura_aqui
```

---

## 🚀 Passo a Passo para Execução

### 1. Subindo a Infraestrutura (Banco de Dados e Fila)
Na raiz do projeto (onde está o `docker-compose.yml`), inicie os containers do PostgreSQL e do Redis:
```bash
docker-compose up -d
```

### 2. Configurando e Executando o Backend (API REST)
Abra um terminal, navegue até a pasta `/backend` e siga os passos:

```bash
# Crie e ative o ambiente virtual
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Inicie a API Flask (A API rodará na porta 5000)
python run.py
```

### 3. Executando o Worker (Processador da Fila)
O Worker é o responsável por ler as mensagens do Redis e salvar no PostgreSQL. **Em um novo terminal**, com o ambiente virtual ativado na pasta `/backend`:

```bash
python worker.py
```
*(Mantenha o terminal aberto. Você verá os logs de processamento das requisições aqui).*

### 4. Configurando e Executando o Frontend (Angular)
Abra um terceiro terminal, navegue até a pasta `/frontend` e inicie a aplicação:

```bash
# Instale as dependências do Node
npm install

# Inicie o servidor de desenvolvimento (Rodará na porta 4200)
ng serve -o
```

---

## 🧪 Como Testar a Aplicação

A aplicação subirá com um usuário administrador padrão configurado no banco de dados para facilitar os testes.

1. Acesse `http://localhost:4200/login` no seu navegador.
2. Utilize as seguintes credenciais:
   * **E-mail:** `admin@teste.com`
   * **Senha:** `123456`
3. Após o login, você será redirecionado para o Dashboard protegido, onde poderá realizar o CRUD de produtos.
4. **Dica de Teste:** Ao criar, editar ou excluir um produto, observe o terminal onde o `worker.py` está rodando para ver o processamento assíncrono da fila em tempo real.

---

## 🛡️ Decisões de Arquitetura

* **Route Guards:** O frontend bloqueia o acesso à rota de produtos se o token JWT não estiver presente, redirecionando para o login.
* **Separação de Responsabilidades:** A API (`run.py`) não escreve diretamente no banco durante operações de mutação (POST, PUT, DELETE). Ela apenas enfileira no Redis e retorna `202 Accepted`, delegando a carga de escrita para o Worker.
