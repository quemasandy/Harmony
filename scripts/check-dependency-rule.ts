import * as fs from 'fs';
import * as path from 'path';

const ENTITIES_DIR = path.join(__dirname, '../src/harmonic-analysis/entities');

function checkDirectory(dir: string): boolean {
  const files = fs.readdirSync(dir);
  let failed = false;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (checkDirectory(fullPath)) failed = true;
    } else if (fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        // Enforce that entities cannot import from adapters or use-cases
        if (line.match(/from\s+['"](?:\.\.\/)+adapters/) || line.match(/from\s+['"](?:\.\.\/)+use-cases/)) {
          console.error(`❌ Dependency rule violation in ${fullPath}:${i+1}`);
          console.error(`   ${line}`);
          failed = true;
        }
      }
    }
  }
  return failed;
}

const failed = checkDirectory(ENTITIES_DIR);
if (failed) {
  console.error('\nPrincipio I: Regla de Dependencia was violated. Entities cannot import from outer rings.');
  process.exit(1);
} else {
  console.log('✅ Architecture verification passed: Entities do not depend on outer rings.');
  process.exit(0);
}
