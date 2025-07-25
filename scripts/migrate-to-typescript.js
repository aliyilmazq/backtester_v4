#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const EXTENSIONS_MAP = {
  '.js': '.ts',
  '.jsx': '.tsx',
};

const DIRECTORIES_TO_MIGRATE = ['src', 'server', 'tests'];

function shouldMigrateFile(filePath) {
  const ext = path.extname(filePath);
  return ext === '.js' || ext === '.jsx';
}

function getNewFileName(filePath) {
  const ext = path.extname(filePath);
  const base = filePath.slice(0, -ext.length);
  return base + EXTENSIONS_MAP[ext];
}

function migrateFile(filePath) {
  if (!shouldMigrateFile(filePath)) return;

  const newPath = getNewFileName(filePath);

  console.log(`Renaming ${filePath} -> ${newPath}`);

  fs.renameSync(filePath, newPath);
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'build' && file !== 'dist') {
        walkDirectory(filePath);
      }
    } else {
      migrateFile(filePath);
    }
  });
}

function updateImports() {
  console.log('\nUpdating import statements...');

  const updateImportsInFile = (filePath) => {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Update relative imports
    content = content.replace(/from\s+['"](\.[^'"]+)\.(js|jsx)['"]/g, "from '$1'");

    content = content.replace(/import\s+['"](\.[^'"]+)\.(js|jsx)['"]/g, "import '$1'");

    fs.writeFileSync(filePath, content);
  };

  DIRECTORIES_TO_MIGRATE.forEach((dir) => {
    if (fs.existsSync(dir)) {
      walkDirectoryAndProcess(dir, updateImportsInFile);
    }
  });
}

function walkDirectoryAndProcess(dir, processor) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'build' && file !== 'dist') {
        walkDirectoryAndProcess(filePath, processor);
      }
    } else {
      processor(filePath);
    }
  });
}

console.log('Starting TypeScript migration...\n');

// Step 1: Rename files
DIRECTORIES_TO_MIGRATE.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`Migrating ${dir}...`);
    walkDirectory(dir);
  }
});

// Step 2: Update imports
updateImports();

console.log('\nMigration complete!');
console.log('\nNext steps:');
console.log('1. Run "npm run lint" to check for TypeScript errors');
console.log('2. Add type annotations to your code');
console.log('3. Update your webpack/build configuration if needed');
console.log('4. Run tests to ensure everything still works');
