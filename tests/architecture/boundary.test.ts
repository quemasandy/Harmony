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

describe('Architecture Boundary Contract (Clean Architecture)', () => {
  const rootDir = path.resolve(__dirname, '../../src');
  
  test('Interface Adapters (JSON Presenter) must not import domain entities directly', () => {
    const presenterDir = path.join(rootDir, 'harmonic-analysis/interface-adapters');
    const presenterFiles = getAllTypeScriptFiles(presenterDir);

    presenterFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (!line.trim().startsWith('import ')) return;
        
        // Ensure no adapter imports from entities
        const importsDomain = line.match(/from\s+['"](.*)entities/);
        expect(importsDomain).toBeNull();
      });
    });
  });

  test('Application DTOs must not leak domain entities', () => {
    const dtosDir = path.join(rootDir, 'harmonic-analysis/use-cases/dtos');
    const dtoFiles = getAllTypeScriptFiles(dtosDir);
    
    dtoFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (!line.trim().startsWith('import ')) return;
        
        const importsDomain = line.match(/from\s+['"](.*)entities/);
        expect(importsDomain).toBeNull();
      });
    });
  });

  test('Domain entities must not depend on application or interface adapters', () => {
    const entitiesDir = path.join(rootDir, 'harmonic-analysis/entities');
    const entityFiles = getAllTypeScriptFiles(entitiesDir);
    
    entityFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (!line.trim().startsWith('import ')) return;
        
        const importsAdapters = line.match(/from\s+['"](.*)interface-adapters/);
        const importsUseCases = line.match(/from\s+['"](.*)use-cases/);
        
        expect(importsAdapters).toBeNull();
        expect(importsUseCases).toBeNull();
      });
    });
  });
});
