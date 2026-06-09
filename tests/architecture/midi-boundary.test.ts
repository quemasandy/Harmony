import { describe, test, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function getAllTypeScriptFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllTypeScriptFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

describe('MIDI Adapter Boundary Contract', () => {
  const rootDir = path.resolve(__dirname, '../../src/harmonic-analysis');
  
  test('Inner rings must not import from frameworks/midi', () => {
    const dirsToCheck = [
      path.join(rootDir, 'entities'),
      path.join(rootDir, 'use-cases'),
      path.join(rootDir, 'application'),
      path.join(rootDir, 'interface-adapters'),
      path.join(rootDir, 'adapters') // F5 presenter etc.
    ];
    
    dirsToCheck.forEach(dir => {
      const files = getAllTypeScriptFiles(dir);
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line) => {
          if (!line.trim().startsWith('import ')) return;
          
          const importsMidi = line.match(/from\s+['"](.*)frameworks\/midi/);
          if (importsMidi) {
             throw new Error(`File ${file} illegally imports from frameworks/midi`);
          }
          expect(importsMidi).toBeNull();
        });
      });
    });
  });
});
