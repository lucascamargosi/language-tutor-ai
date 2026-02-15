import fs from 'fs';
import path from 'path';

// define o caminho absoluto para o arquivo de perfil para evitar erros de diretório
const profilePath = path.resolve('services/memory/user_profile.json');

/**
 * Lê o perfil do usuário do sistema de arquivos.
 * @returns {Object|null} O objeto do perfil ou null em caso de erro.
 */
export function getUserProfile() {
  try {
    const data = fs.readFileSync(profilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading profile', error);
    return null;
  }
}

/**
 * Atualiza o perfil mesclando os novos dados com os existentes.
 * @param {Object} updates - Objeto contendo os campos a serem atualizados.
 */
export function updateUserProfile(updates) {
  try {
    const currentProfile = getUserProfile();
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      last_updated: new Date().toISOString(), // carimbo de data/hora automatico
    };

    // salva o JSON formatado com 2 espaços de indentação
    fs.writeFileSync(profilePath, JSON.stringify(updatedProfile, null, 2));
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile', error);
  }
}
