import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('database/tutor.db');
const db = new Database(dbPath);

// tabela de mensagens (historico)
db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

// Migração: verifica se user_profile tem estrutura correta e migra se necessário
function migrateUserProfileTable() {
  try {
    // tenta verificar a estrutura atual
    const tableInfo = db.prepare('PRAGMA table_info(user_profile)').all();
    const columns = tableInfo.map((info) => info.name);

    // se a tabela tem estrutura antiga (key, value), migra
    if (columns.includes('key') && columns.includes('value')) {
      console.log(
        '[DB Migration] Detectada tabela user_profile antiga, recriando...',
      );
      db.exec('DROP TABLE IF EXISTS user_profile');

      // cria tabela com nova estrutura
      db.exec(`
        CREATE TABLE user_profile (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          level TEXT NOT NULL DEFAULT 'A1',
          goal TEXT NOT NULL DEFAULT 'Learn English',
          preferred_language TEXT NOT NULL DEFAULT 'english',
          common_mistakes TEXT NOT NULL DEFAULT '[]',
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
      console.log('[DB Migration] Tabela user_profile recriada com sucesso');
    } else if (columns.length === 0) {
      // tabela não existe, cria com estrutura nova
      db.exec(`
        CREATE TABLE IF NOT EXISTS user_profile (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          level TEXT NOT NULL DEFAULT 'A1',
          goal TEXT NOT NULL DEFAULT 'Learn English',
          preferred_language TEXT NOT NULL DEFAULT 'english',
          common_mistakes TEXT NOT NULL DEFAULT '[]',
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
  } catch (error) {
    console.error('[DB Migration] Erro durante migração:', error);
  }
}

migrateUserProfileTable();

export default db;
