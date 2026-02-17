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

    // cria a tabela de perfil para retirar o JSON no futuro
db.exec(`
    CREATE TABLE IF NOT EXISTS user_profile (
        key TEXT PRIMARY KEY,
        value TEXT)`);

export default db;
