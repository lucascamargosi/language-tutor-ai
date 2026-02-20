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

// cria a tabela de perfil do usuário (uma única linha com o perfil atual)
db.exec(`
    CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        level TEXT NOT NULL DEFAULT 'A1',
        goal TEXT NOT NULL DEFAULT 'Learn English',
        preferred_language TEXT NOT NULL DEFAULT 'english',
        common_mistakes TEXT NOT NULL DEFAULT '[]',
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

export default db;
