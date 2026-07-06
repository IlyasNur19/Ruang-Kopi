import fs from 'fs';
import path from 'path';

// Directories to process
const dirs = [
  'apps/web/src',
  'apps/api/src',
  'packages/shared/src',
];

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.css'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file === 'node_modules' || file === '.git') continue;
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (extensions.includes(path.extname(file))) {
        arrayOfFiles.push(fullPath);
      }
    }
  }
  return arrayOfFiles;
}

const rootDir = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');

let modifiedFiles = 0;

for (const dir of dirs) {
  const fullDir = path.join(rootDir, dir);
  const files = getAllFiles(fullDir);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    const cleaned = [];

    for (const line of lines) {
      // Skip lines that are only empty JSX expressions (leftover from comment removal)
      if (/^\s*\{\}\s*$/.test(line)) {
        continue;
      }
      cleaned.push(line);
    }

    // Remove consecutive empty lines (more than 1)
    const final = [];
    let prevEmpty = false;
    for (const line of cleaned) {
      const isEmpty = line.trim() === '';
      if (isEmpty && prevEmpty) continue;
      final.push(line);
      prevEmpty = isEmpty;
    }

    // Remove trailing empty lines
    while (final.length > 0 && final[final.length - 1].trim() === '') final.pop();
    
    const result = final.join('\n') + '\n';

    if (result !== content) {
      fs.writeFileSync(file, result, 'utf-8');
      modifiedFiles++;
      console.log(`Cleaned: ${path.relative(rootDir, file)}`);
    }
  }
}

console.log(`\nDone! Cleaned ${modifiedFiles} files of empty JSX expressions.`);
