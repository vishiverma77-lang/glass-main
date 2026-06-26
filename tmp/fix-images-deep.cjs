const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Office-Work/Hostinger-Website/Glass-main/Glass-main/src';
const directories = ['pages', 'components'];

const patterns = [
    // Pattern 1: Object property (e.g., image: ...)
    {
        regex: /image: item\.images \?\.\[0\] \? \(item\.images\[0\]\?\.startsWith\('http'\) \? item\.images\[0\] : `\${import\.meta\.env\.VITE_API_BASE_URL}\${item\.images\[0\]}`\) : "\/logo\.jpg"/g,
        replacement: 'image: getImageUrl(item.images?.[0])'
    },
    // Pattern 2: Component prop (e.g., image={...})
    {
        regex: /image={item\.images\?\.\[0\] \? \(item\.images\[0\]\?\.startsWith\('http'\) \? item\.images\[0\] : `\${import\.meta\.env\.VITE_API_BASE_URL}\${item\.images\[0\]}`\) : "\/logo\.jpg"}/g,
        replacement: 'image={getImageUrl(item.images?.[0])}'
    },
    // Pattern 3: src attribute (e.g., src={...})
    {
        regex: /src={item\.images && item\.images\[0\] \? \(item\.images\[0\]\.startsWith\('http'\) \? item\.images\[0\] : \(item\.images\[0\]\?\.startsWith\('http'\) \? item\.images\[0\] : `\${import\.meta\.env\.VITE_API_BASE_URL}\${item\.images\[0\]}`\)\) : ""}/g,
        replacement: 'src={getImageUrl(item.images?.[0])}'
    },
    // Pattern 4: HomePage specific
    {
        regex: /src={item\.images\?\.\[0\] \? \(item\.images\[0\]\?\.startsWith\('http'\) \? item\.images\[0\] : `\${import\.meta\.env\.VITE_API_BASE_URL}\${item\.images\[0\]}`\) : "\/logo\.jpg"}/g,
        replacement: 'src={getImageUrl(item.images?.[0])}'
    },
    // Pattern 5: Cart Drawer specific
    {
        regex: /: \(item\.images\[0\]\?\.startsWith\('http'\) \? item\.images\[0\] : `\${import\.meta\.env\.VITE_API_BASE_URL}\${item\.images\[0\]}`\)/g,
        replacement: ': getImageUrl(item.images?.[0])'
    },
    // Pattern 6: Basic ternary
    {
        regex: /\(item\.images\[0\]\?\.startsWith\('http'\) \? item\.images\[0\] : `\${import\.meta\.env\.VITE_API_BASE_URL}\${item\.images\[0\]}`\)/g,
        replacement: 'getImageUrl(item.images?.[0])'
    }
];

function processDirectory(dir) {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) return;
    
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    
    entries.forEach(entry => {
        const entryPath = path.join(fullPath, entry.name);
        if (entry.isDirectory()) {
            processDirectory(path.join(dir, entry.name));
        } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
            let content = fs.readFileSync(entryPath, 'utf8');
            let changed = false;
            
            patterns.forEach(p => {
                if (p.regex.test(content)) {
                    content = content.replace(p.regex, p.replacement);
                    changed = true;
                }
            });
            
            if (changed) {
                // Ensure import exists
                if (!content.includes('import { getImageUrl } from')) {
                    // Try to find correct relative path
                    const depth = dir.split(path.sep).length;
                    const relativePrefix = '../'.repeat(depth);
                    const importPath = `${relativePrefix}utils/imageUtils`;
                    content = `import { getImageUrl } from "${importPath}";\n` + content;
                }
                
                fs.writeFileSync(entryPath, content, 'utf8');
                console.log(`✅ Updated: ${entryPath}`);
            }
        }
    });
}

directories.forEach(processDirectory);
console.log('--- Deep Migration Finished ---');
