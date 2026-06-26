import fs from 'fs';
import path from 'path';

const dir = './src/pages';
const files = fs.readdirSync(dir).filter(f => f.startsWith('ShopBy'));

files.forEach(f => {
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  
  // Replace the old pattern with the new pattern
  c = c.replace(/image:\s*item\.images\?\\.\[0\]\s*\|\|\s*["']\/products\/default\.jpg["']/g, 'image: item.images && item.images.length > 0 ? `http://localhost:5000${item.images[0]}` : "/products/default.jpg"');
  // Or simpler replacing just the string if regex syntax was messy
  c = c.split('image: item.images?.[0] || "/products/default.jpg"').join('image: item.images && item.images.length > 0 ? `http://localhost:5000${item.images[0]}` : "/products/default.jpg"');
  
  fs.writeFileSync(p, c);
});
console.log('✅ Applied Image Patch to 86 pages');
