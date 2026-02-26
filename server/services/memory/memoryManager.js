import db from '../../database/db.js';

// garante que existe pelo menos 1 linha de perfil no banco
function ensureProfileExists() {
  try {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM user_profile');
    const result = stmt.get();

    if (result.count === 0) {
      // insere o perfil padrão
      const defaultProfile = {
        level: 'A1',
        goal: 'Learn English',
        preferred_language: 'english',
        common_mistakes: [],
      };

      const insert = db.prepare(`
        INSERT INTO user_profile (id, level, goal, preferred_language, common_mistakes, last_updated)
        VALUES (1, ?, ?, ?, ?, datetime('now'))
      `);
      insert.run(
        defaultProfile.level,
        defaultProfile.goal,
        defaultProfile.preferred_language,
        JSON.stringify(defaultProfile.common_mistakes),
      );
    }
  } catch (error) {
    console.error('Erro ao garantir perfil no banco:', error);
  }
}

/**
 * Lê o perfil do usuário do SQLite.
 * @returns {Object} O objeto do perfil com todas as propriedades.
 */
export function getUserProfile() {
  try {
    ensureProfileExists();  // garante que existe 

    const stmt = db.prepare('SELECT * FROM user_profile WHERE id = 1');
    const row = stmt.get();

    if (!row) { // fallback se vier null 
      return {
        level: 'A1',
        goal: 'Learn English',
        preferred_language: 'english',
        common_mistakes: [],
        last_updated: new Date().toISOString(),
      };
    }

    return {
      level: row.level,
      goal: row.goal,
      preferred_language: row.preferred_language,
      common_mistakes: JSON.parse(row.common_mistakes || '[]'),
      last_updated: row.last_updated,
    };
  } catch (error) {
    console.error('Erro ao ler perfil do SQLite:', error);
    return { // fallback se der erro
      level: 'A1',
      goal: 'Learn English',
      preferred_language: 'english',
      common_mistakes: [],
      last_updated: new Date().toISOString(),
    };
  }
}

/**
 * Atualiza o perfil do usuário mesclando com dados existentes.
 * @param {Object} updates - Objeto contendo os campos a serem atualizados.
 */
export function updateUserProfile(updates) {
  try {
    ensureProfileExists();

    const currentProfile = getUserProfile();
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      last_updated: new Date().toISOString(),
    };

    const stmt = db.prepare(`
      UPDATE user_profile 
      SET level = ?, goal = ?, preferred_language = ?, common_mistakes = ?, last_updated = datetime('now')
      WHERE id = 1
    `);
    stmt.run(
      updatedProfile.level,
      updatedProfile.goal,
      updatedProfile.preferred_language,
      JSON.stringify(updatedProfile.common_mistakes),
    );

    return updatedProfile;
  } catch (error) {
    console.error('Erro ao atualizar perfil no SQLite:', error);
    return null;
  }
}
