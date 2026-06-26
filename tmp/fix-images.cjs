const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Office-Work/Hostinger-Website/Glass-main/Glass-main/src/pages';
const files = fs.readdirSync(srcDir).filter(f => f.startsWith('ShopBy') && f.endsWith('.jsx'));

console.log(`Found ${files.length} ShopBy components to update.`);

files.forEach(file => {
    const filePath = path.join(srcDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let changed = false;

    // 1. Add import if it doesn't exist
    if (!content.includes('import { getImageUrl } from "../utils/imageUtils"')) {
        content = 'import { getImageUrl } from "../utils/imageUtils";\n' + content;
        changed = true;
    }

    // 2. Replace the old image construction logic
    // Pattern: image: item.images && item.images.length > 0 ? (item.images[0]?.startsWith('http') ? item.images[0] : `${import.meta.env.VITE_API_BASE_URL}${item.images[0]}`) : "/products/default.jpg",
    const oldPattern = /image: item\.images && item\.images\.length > 0 \? \(item\.images\[0\]\?\.startsWith\('http'\) \? item\.images\[0\] : `\${import\.meta\.env\.VITE_API_BASE_URL}\${item\.images\[0\]}`\) : "\/products\/default\.jpg"/g;
    
    if (oldPattern.test(content)) {
        content = content.replace(oldPattern, 'image: getImageUrl(item.images?.[0])');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
    } else {
        console.log(`⏩ Skipped: ${file} (Already updated or pattern not found)`);
    }
});

console.log('--- Migration Finished ---');
