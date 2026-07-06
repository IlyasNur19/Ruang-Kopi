import fs from 'fs';
import path from 'path';

// Directories to process
const dirs = [
  'apps/web/src',
  'apps/api/src',
  'packages/shared/src',
];

// Config files at root level to also process
const configFiles = [
  'apps/web/eslint.config.js',
  'apps/web/postcss.config.js',
  'apps/web/tailwind.config.js',
  'apps/web/vite.config.js',
  'apps/api/drizzle.config.ts',
  'turbo.json',
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

function removeComments(code, filePath) {
  const isCSS = filePath.endsWith('.css');
  
  if (isCSS) {
    return removeCSSComments(code);
  }
  return removeJSComments(code);
}

function removeCSSComments(code) {
  // Remove /* ... */ comments in CSS
  // But preserve content within strings
  let result = '';
  let i = 0;
  while (i < code.length) {
    // Check for string literals
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      result += quote;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') {
          result += code[i];
          i++;
          if (i < code.length) {
            result += code[i];
            i++;
          }
        } else {
          result += code[i];
          i++;
        }
      }
      if (i < code.length) {
        result += code[i]; // closing quote
        i++;
      }
    }
    // Check for block comments /* */
    else if (code[i] === '/' && i + 1 < code.length && code[i + 1] === '*') {
      // Check if it's a Tailwind directive like /*! ... */
      if (i + 2 < code.length && code[i + 2] === '!') {
        // Keep important comments
        const endIdx = code.indexOf('*/', i + 2);
        if (endIdx !== -1) {
          result += code.substring(i, endIdx + 2);
          i = endIdx + 2;
        } else {
          i += 2;
        }
      } else {
        // Skip block comment
        const endIdx = code.indexOf('*/', i + 2);
        if (endIdx !== -1) {
          i = endIdx + 2;
        } else {
          i += 2;
        }
      }
    }
    else {
      result += code[i];
      i++;
    }
  }
  return result;
}

function removeJSComments(code) {
  let result = '';
  let i = 0;
  
  while (i < code.length) {
    // Handle template literals
    if (code[i] === '`') {
      result += code[i];
      i++;
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') {
          result += code[i];
          i++;
          if (i < code.length) {
            result += code[i];
            i++;
          }
        } else if (code[i] === '$' && i + 1 < code.length && code[i + 1] === '{') {
          // Template expression - need to handle nested braces
          result += code[i]; // $
          i++;
          result += code[i]; // {
          i++;
          let braceDepth = 1;
          while (i < code.length && braceDepth > 0) {
            if (code[i] === '{') braceDepth++;
            else if (code[i] === '}') braceDepth--;
            if (braceDepth > 0) {
              result += code[i];
              i++;
            }
          }
          if (i < code.length) {
            result += code[i]; // closing }
            i++;
          }
        } else {
          result += code[i];
          i++;
        }
      }
      if (i < code.length) {
        result += code[i]; // closing `
        i++;
      }
    }
    // Handle string literals (double quotes)
    else if (code[i] === '"') {
      result += code[i];
      i++;
      while (i < code.length && code[i] !== '"' && code[i] !== '\n') {
        if (code[i] === '\\') {
          result += code[i];
          i++;
          if (i < code.length) {
            result += code[i];
            i++;
          }
        } else {
          result += code[i];
          i++;
        }
      }
      if (i < code.length && code[i] === '"') {
        result += code[i];
        i++;
      }
    }
    // Handle string literals (single quotes)
    else if (code[i] === "'") {
      result += code[i];
      i++;
      while (i < code.length && code[i] !== "'" && code[i] !== '\n') {
        if (code[i] === '\\') {
          result += code[i];
          i++;
          if (i < code.length) {
            result += code[i];
            i++;
          }
        } else {
          result += code[i];
          i++;
        }
      }
      if (i < code.length && code[i] === "'") {
        result += code[i];
        i++;
      }
    }
    // Handle regex literals
    else if (code[i] === '/') {
      // Check if it's a line comment
      if (i + 1 < code.length && code[i + 1] === '/') {
        // Skip until end of line
        while (i < code.length && code[i] !== '\n') {
          i++;
        }
      }
      // Check if it's a block comment
      else if (i + 1 < code.length && code[i + 1] === '*') {
        const endIdx = code.indexOf('*/', i + 2);
        if (endIdx !== -1) {
          i = endIdx + 2;
        } else {
          i += 2;
        }
      }
      // Check if it could be a regex literal
      else {
        // Look back to determine if this is a regex or division
        const prevNonSpace = getPrevNonSpace(result);
        if (isRegexContext(prevNonSpace)) {
          // It's a regex literal - copy it as-is
          result += code[i]; // opening /
          i++;
          while (i < code.length && code[i] !== '/' && code[i] !== '\n') {
            if (code[i] === '\\') {
              result += code[i];
              i++;
              if (i < code.length) {
                result += code[i];
                i++;
              }
            } else if (code[i] === '[') {
              // Character class
              result += code[i];
              i++;
              while (i < code.length && code[i] !== ']' && code[i] !== '\n') {
                if (code[i] === '\\') {
                  result += code[i];
                  i++;
                  if (i < code.length) {
                    result += code[i];
                    i++;
                  }
                } else {
                  result += code[i];
                  i++;
                }
              }
              if (i < code.length && code[i] === ']') {
                result += code[i];
                i++;
              }
            } else {
              result += code[i];
              i++;
            }
          }
          if (i < code.length && code[i] === '/') {
            result += code[i]; // closing /
            i++;
            // Copy flags
            while (i < code.length && /[gimsuy]/.test(code[i])) {
              result += code[i];
              i++;
            }
          }
        } else {
          // It's a division operator
          result += code[i];
          i++;
        }
      }
    }
    // Handle JSX comments {/* ... */}
    else {
      result += code[i];
      i++;
    }
  }
  
  return result;
}

function getPrevNonSpace(str) {
  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] !== ' ' && str[i] !== '\t') {
      return str[i];
    }
  }
  return '';
}

function isRegexContext(prevChar) {
  // After these characters, a / is likely starting a regex
  return ['', '(', '[', '{', ';', ',', '=', '!', '&', '|', '?', ':', '+', '-', '~', '^', '<', '>', '\n', undefined].includes(prevChar) 
    || prevChar === undefined;
}

function cleanEmptyLines(code) {
  // Remove lines that are now empty (were comment-only lines)
  const lines = code.split('\n');
  const cleaned = [];
  let prevWasEmpty = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      if (!prevWasEmpty) {
        cleaned.push('');
        prevWasEmpty = true;
      }
    } else {
      // Remove trailing whitespace from lines that had inline comments removed
      cleaned.push(line.replace(/\s+$/, ''));
      prevWasEmpty = false;
    }
  }
  
  // Remove leading/trailing empty lines
  while (cleaned.length > 0 && cleaned[0].trim() === '') cleaned.shift();
  while (cleaned.length > 0 && cleaned[cleaned.length - 1].trim() === '') cleaned.pop();
  
  return cleaned.join('\n') + '\n';
}

// Main execution
const rootDir = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');

let totalFiles = 0;
let modifiedFiles = 0;

// Process directories
for (const dir of dirs) {
  const fullDir = path.join(rootDir, dir);
  const files = getAllFiles(fullDir);
  
  for (const file of files) {
    totalFiles++;
    const content = fs.readFileSync(file, 'utf-8');
    let processed = removeComments(content, file);
    processed = cleanEmptyLines(processed);
    
    if (processed !== content) {
      fs.writeFileSync(file, processed, 'utf-8');
      modifiedFiles++;
      console.log(`Modified: ${path.relative(rootDir, file)}`);
    }
  }
}

// Process individual config files
for (const cf of configFiles) {
  const fullPath = path.join(rootDir, cf);
  if (fs.existsSync(fullPath)) {
    totalFiles++;
    const content = fs.readFileSync(fullPath, 'utf-8');
    let processed = removeComments(content, fullPath);
    processed = cleanEmptyLines(processed);
    
    if (processed !== content) {
      fs.writeFileSync(fullPath, processed, 'utf-8');
      modifiedFiles++;
      console.log(`Modified: ${cf}`);
    }
  }
}

console.log(`\nDone! Processed ${totalFiles} files, modified ${modifiedFiles} files.`);
