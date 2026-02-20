import db from '../../database/db.js';

// garante que existe uma conversa ativa (retorna id da conversation)
export function ensureActiveConversation() {
  try {
    // tenta obter a conversa mais recente
    const stmt = db.prepare(
      'SELECT id FROM conversations ORDER BY updated_at DESC LIMIT 1',
    );
    let conversation = stmt.get();

    // se não houver, cria uma conversa padrão
    if (!conversation) {
      const insert = db.prepare('INSERT INTO conversations (title) VALUES (?)');
      const result = insert.run('Chat');
      conversation = { id: result.lastInsertRowid };
    }

    return conversation.id;
  } catch (error) {
    console.error('Erro ao garantir conversa ativa:', error);
    return 1;
  }
}

// salva uma mensagem no banco de dados SQLite
export function saveMessage(role, content, conversationId = null) {
  try {
    const convId = conversationId || ensureActiveConversation();
    const insert = db.prepare(
      'INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)',
    );
    insert.run(convId, role, content);

    // atualiza updated_at da conversa
    const update = db.prepare(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    );
    update.run(convId);
  } catch (error) {
    console.log('Erro ao salvar no SQLite', error);
  }
}

// recupera as últimas N mensagens de uma conversa para o Sliding Window
export function getLatestMessages(limit = 10, conversationId = null) {
  try {
    const convId = conversationId || ensureActiveConversation();
    const stmt = db.prepare(
      'SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT ?',
    );
    const rows = stmt.all(convId, limit);
    return rows.reverse(); // inverte para manter a ordem cronologica
  } catch (error) {
    console.error('Erro ao ler do SQLite:', error);
    return [];
  }
}

// deleta todas as mensagens de uma conversa
export function deleteConversationMessages(conversationId) {
  try {
    const stmt = db.prepare('DELETE FROM messages WHERE conversation_id = ?');
    stmt.run(conversationId);
  } catch (error) {
    console.error('Erro ao deletar mensagens:', error);
  }
}

