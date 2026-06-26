import fs from 'fs';
import path from 'path';

const searchDir = './src';
const localUrlRegex1 = /http:\/\/localhost:5000/g;
const localUrlRegex2 = /localhost:5000/g;

function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      replaceInFiles(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.html') || filePath.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Skip this script itself
      if (filePath.includes('replace_local.js')) continue;

      if (localUrlRegex1.test(content)) {
        content = content.replace(localUrlRegex1, '${import.meta.env.VITE_API_BASE_URL || "https://backend-60eg.onrender.com"}');
        modified = true;
      }

      // If there are still occurrences of localhost:5000 (without http)
      if (localUrlRegex2.test(content)) {
        content = content.replace(localUrlRegex2, 'backend-60eg.onrender.com');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated local URL references in: ${filePath}`);
      }
    }
  }
}

console.log("Scanning files for hardcoded localhost:5000 references...");
replaceInFiles(searchDir);
console.log("Scan and replacement completed successfully!");
