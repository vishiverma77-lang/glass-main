import fs from 'fs';
import path from 'path';

const searchDir = './src';
const searchStr = 'localhost:5000';

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      searchFiles(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.html') || filePath.endsWith('.css')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(searchStr)) {
        console.log(`Found hardcoded URL in: ${filePath}`);
        // print matching lines
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes(searchStr)) {
            console.log(`  Line ${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

searchFiles(searchDir);
