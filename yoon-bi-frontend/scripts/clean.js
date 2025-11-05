/**
 * Script de nettoyage automatique
 * Usage: npm run clean
 */

import { unlink, rmdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const filesToDelete = [
  'src/App.DEBUG.tsx',
  'public/clear-storage.html',
];

const dirsToDelete = [
  'docs',
];

async function clean() {
  console.log('🧹 Nettoyage du code...\n');

  let deletedCount = 0;

  // Supprimer les fichiers
  for (const file of filesToDelete) {
    const filePath = join(process.cwd(), file);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
        console.log(`✓ Supprimé: ${file}`);
        deletedCount++;
      } catch (error) {
        console.error(`✗ Erreur lors de la suppression de ${file}:`, error.message);
      }
    } else {
      console.log(`- Déjà supprimé: ${file}`);
    }
  }

  // Supprimer les dossiers
  for (const dir of dirsToDelete) {
    const dirPath = join(process.cwd(), dir);
    if (existsSync(dirPath)) {
      try {
        await rmdir(dirPath, { recursive: true });
        console.log(`✓ Supprimé: ${dir}/`);
        deletedCount++;
      } catch (error) {
        console.error(`✗ Erreur lors de la suppression de ${dir}:`, error.message);
      }
    } else {
      console.log(`- Déjà supprimé: ${dir}/`);
    }
  }

  console.log(`\n✅ Nettoyage terminé! (${deletedCount} éléments supprimés)`);
  console.log('\n💡 Les logs console sont conservés pour le développement.');
  console.log('   Pour la production, utilisez: npm run build:prod');
}

clean().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
