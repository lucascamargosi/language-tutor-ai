# Language Tutor AI

Um tutor de idiomas inteligente que utiliza IA local para processar diálogos em tempo real via streaming.

## Funcionalidades Principais

- **Multi-Conversa:** Gerenciador de múltiplas conversas com auto-titulação via IA.
- **Memória de Longo Prazo:** Persistência de perfil do usuário (nível de proficiência e histórico de erros).
- **Histórico Persistente:** Todas as conversas são salvas em banco de dados SQLite com relacionamento.
- **Streaming de Respostas:** Processamento em tempo real para uma experiência fluida.
- **Sliding Window Context:** Gerenciamento inteligente de contexto para otimizar uso de tokens.
- **UI Responsiva:** Layout mobile-first com drawer sidebar e hamburger menu.
- **Componentes Modularizados:** Message, MarkdownRenderer, CodeBlock, ChatSidebar separados e reutilizáveis.
- **Foco Pedagógico:** IA instruída para agir como tutor, corrigindo erros e explicando gramática.
- **Markdown Completo:** Renderização de Markdown com GFM, code highlighting e suporte a quebras de linha.
- **Auto-Focus UX:** Campo de input auto-focado ao criar/mudar de conversa.
- **Acessibilidade:** Atributos semânticos de form (id, name) para melhor acessibilidade.

## Tecnologias

### Frontend

- **React** 19 + **Vite** (build tool)
- **Tailwind CSS** 4 com plugin typography
- **react-markdown** com plugins:
  - `remark-gfm` - GitHub Flavored Markdown
  - `remark-breaks` - Line break suporte
  - `rehype-highlight` - Syntax highlighting com highlight.js

### Backend

- **Node.js** + **Express.js**
- **Ollama** (Local LLM engine)
- **SQLite** com better-sqlite3

### Arquitetura

- **HTTP Streaming** (Chunked transfer encoding) para respostas streaming
- **Database:** Multi-conversa com schema relacional (conversations ↔ messages)

## Pré-requisitos

Antes de começar, você precisará ter instalado:

1. [Node.js](https://nodejs.org) (v18 ou superior)
2. [Ollama](https://ollama.com)
3. Um modelo de IA baixado (ex: `ollama run llama3.1`)

## Configuração

### 1. Clone o repositório:

```bash
git clone https://github.com/lucascamargosi/language-tutor-ai.git
cd language-tutor-ai
```

### 2. Configure o servidor:

```bash
cd server
npm install
```

### 3. Crie um arquivo `.env` na pasta server:

```env
PORT=3001
OLLAMA_HOST=http://127.0.0.1:11434
DEFAULT_MODEL=llama3.1
```

### 4. Configure o cliente:

```bash
cd ../client
npm install
```

## Como Rodar

### Terminal 1: Servidor

```bash
cd server
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### Terminal 2: Cliente

```bash
cd client
npm run dev
```

O cliente estará disponível em `http://localhost:5173`

> **Nota:** O banco de dados SQLite (`tutor.db`) será criado automaticamente na primeira execução do servidor.

## API Endpoints

### Gerenciar Conversas

#### GET /api/conversations

Lista todas as conversas.

```bash
curl http://localhost:3001/api/conversations
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Present Perfect Tense",
    "created_at": "2026-02-20T20:00:00Z",
    "updated_at": "2026-02-20T21:05:00Z"
  }
]
```

#### POST /api/conversations

Cria uma nova conversa.

```bash
curl -X POST http://localhost:3001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Chat"}'
```

**Response:**

```json
{
  "id": 1,
  "title": "My First Chat",
  "created_at": "2026-02-20T20:00:00Z",
  "updated_at": "2026-02-20T20:00:00Z"
}
```

#### PATCH /api/conversations/:id

Renomeia uma conversa.

```bash
curl -X PATCH http://localhost:3001/api/conversations/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

#### DELETE /api/conversations/:id

Deleta uma conversa e todas suas mensagens.

```bash
curl -X DELETE http://localhost:3001/api/conversations/1
```

---

### Chat e Histórico

#### POST /api/chat

Envia uma mensagem e recebe resposta via streaming.

```bash
curl -N -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain the present perfect tense", "conversationId": 1}'
```

**Response:** Text stream (chunked)

#### GET /api/conversations/:id/history

Recupera o histórico de uma conversa específica.

```bash
curl http://localhost:3001/api/conversations/1/history
```

**Response:**

```json
[
  {
    "id": 1,
    "role": "user",
    "content": "Hello",
    "conversation_id": 1
  },
  {
    "id": 2,
    "role": "assistant",
    "content": "Hi! How can I help you with your English?",
    "conversation_id": 1
  }
]
```

#### DELETE /api/conversations/:id/history

Limpa o histórico de uma conversa.

```bash
curl -X DELETE http://localhost:3001/api/conversations/1/history
```

---

### Perfil do Usuário

#### GET /api/profile

Retorna o perfil do usuário atual com nível e histórico de erros.

```bash
curl http://localhost:3001/api/profile
```

## Estrutura de Pastas

```
language-tutor-ai/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   └── chat/
│   │   │       ├── ChatHeader.jsx         # Header com profile badge
│   │   │       ├── ChatSidebar.jsx        # Drawer/sidebar com lista de conversas
│   │   │       ├── Conversation.jsx       # Container do histórico
│   │   │       ├── Message.jsx            # Componente individual de mensagem
│   │   │       ├── MarkdownRenderer.jsx   # Renderizador markdown customizado
│   │   │       ├── CodeBlock.jsx          # Bloco de código com copy button
│   │   │       └── InputArea.jsx          # Campo de input
│   │   ├── context/
│   │   │   └── ChatContext.jsx            # Context API para estado do chat
│   │   ├── hooks/
│   │   │   ├── useChat.js                 # Hook para gerenciar chat state
│   │   │   └── useConversations.js        # Hook para gerenciar conversas
│   │   ├── App.jsx                        # Root component
│   │   └── index.css                      # Estilos globais
│   └── package.json
│
└── server/                          # Backend Node.js
    ├── controllers/
    │   └── chat.controller.js             # Lógica de chat
    ├── routes/
    │   └── chat.routes.js                 # Endpoints API
    ├── services/
    │   ├── ai/
    │   │   ├── ollama.provider.js         # Integração Ollama
    │   │   └── promptBuilder.js           # Construtor de prompts customizados
    │   └── memory/
    │       ├── historyService.js          # CRUD de conversas e mensagens
    │       ├── contextManager.js          # Gerenciamento de contexto
    │       ├── memoryManager.js           # Gerenciamento de perfil
    │       └── user_profile.json
    ├── database/
    │   └── db.js                          # Schema SQLite e migrations
    ├── utils/
    │   └── tokenCounter.js                # Contagem de tokens
    ├── server.js                          # Entrada principal
    └── package.json
```

## Fluxo de Dados

```
User Input (InputArea)
    ↓
useChat Hook (sendMessage)
    ↓
POST /api/chat (conversationId + message)
    ↓
Chat Controller (routes request)
    ↓
Ollama Provider (chunked streaming response)
    ↓
Message salvo em DB (historyService)
    ↓
MarkdownRenderer (renderiza com syntax highlighting)
    ↓
Message Component (exibe conversa)
```

## Próximas Melhorias

- [ ] Persistência de preferências do usuário
- [ ] Suporte a múltiplos idiomas
- [ ] Temas (light/dark mode)
- [ ] Exportar/importar conversas
- [ ] Analytics de progresso

## Licença

MIT

## Contribuindo

Contributions são bem-vindas! Abra uma issue ou envie um pull request.
