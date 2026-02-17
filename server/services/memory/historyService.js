import db from '../../database/db.js';

// salva uma mensagem no banco de dados SQLite
export function saveMessage(role, content) {
  try {
    const insert = db.prepare(
      'INSERT INTO messages (role, content) VALUES (?, ?)',
    );
    insert.run(role, content);
  } catch (error) {
    console.log('Erro ao salvar no SQLite', error);
  }
}

// recupera as últimas N mensagens para o Sliding Window
export function getLatestMessages(limit = 10) {
  try {
    const stmt = db.prepare(
      'SELECT role, content FROM messages ORDER BY id DESC LIMIT ?',
    );
    const rows = stmt.all(limit);
    return rows.reverse(); // inverte para manter a ordem cronologica
  } catch (error) {
    console.error('Erro ao ler do SQLite:', error);
    return [];
  }
}
