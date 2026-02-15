# Language Tutor AI 

Um tutor de idiomas inteligente que utiliza IA local para processar diálogos em tempo real via streaming.

## Funcionalidades Principais
- **Memória de Longo Prazo:** Persistência de perfil do usuário (nível de proficiência e histórico de erros).
- **Streaming de Respostas:** Processamento em tempo real para uma experiência fluida.
- **Foco Pedagógico:** IA instruída para agir como tutor, corrigindo erros e explicando gramática.
- **UI Moderna:** Renderização de Markdown e destaque de sintaxe para exemplos de código.

##  Tecnologias
- **Frontend:** [React](https://react.dev) + [Vite](https://vitejs.dev)
- **Backend:** [Node.js](https://nodejs.org) + [Express](https://expressjs.com)
- **IA Engine:** [Ollama](https://ollama.com) (Local LLM)
- **Comunicação:** Axios com suporte a HTTP Streaming (Chunked transfer encoding)
- **Persistência:** File System (JSON) com [Path Resolution](https://nodejs.org/api/path.html) seguro.



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
1. **Terminal 1: Server:**
    ```bash
    cd server && npm run dev

2. **Terminal 2: Client:**
    ```bash
    cd client && npm run dev

## Como Testar

    O servidor estará rodando em http://localhost:3001

    Para validar o streaming da IA via terminal, use o comando:

    ```bash
    curl -N -X POST http://localhost:3001/api/chat \
        -H "Content-Type: application/json" \
        -d '{"message": "Explain the perfect present tense"}'