# Language Tutor AI 

Um tutor de idiomas inteligente que utiliza IA local para processar diálogos em tempo real via streaming.

##  Tecnologias
- **Backend:** Node.js & Express
- **IA Engine:** [Ollama](https://ollama.com) (Executando localmente)
- **Comunicação:** Axios com suporte a HTTP Streaming (Chunked transfer encoding)

##  Pré-requisitos
Antes de começar, você precisará ter instalado:
1. [Node.js](https://nodejs.org) (v18 ou superior)
2. [Ollama](https://ollama.com)
3. O modelo de sua preferência baixado (ex: `ollama run llama3.1`)

##  Configuração
1. **Clone o repositório:**
   ```bash
   git clone https://github.com


2. **Entre na pasta do servidor:**
    ```bash
    cd server

3. **Instale as dependências:**
    ```bash
    npm install

4. **Crie um arquivo .env na raiz da pasta server:**
    PORT=3001
    OLLAMA_HOST=http://127.0.0.1:11434
    DEFAULT_MODEL=llama3.1


## Como rodar
    npm run dev

## Como Testar

    O servidor estará rodando em http://localhost:3001

    Para validar o streaming da IA via terminal, use o comando:

    ```bash
    curl -N -X POST http://localhost:3001/api/chat \
        -H "Content-Type: application/json" \
        -d '{"message": "Olá! Como se diz bom dia em inglês?"}' \
        