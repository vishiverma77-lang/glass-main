const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Downloads/Glass-main/Glass-main/src/pages';
const files = fs.readdirSync(dir).filter(f => f.startsWith('ShopBy') && f.endsWith('.jsx'));

let modifiedCount = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // Add import if missing
  if (!content.includes('useProductFilter')) {
    content = content.replace(
      'import React', 
      'import { useProductFilter } from "../hooks/useProductFilter";\nimport React'
    );
    changed = true;
  }

  // Inject ...item, if missing
  if (!content.includes('...item,')) {
    content = content.replace(
      'id: item._id || index,',
      '...item,\n          id: item._id || index,'
    );
    changed = true;
  }

  // Inject useProductFilter hook
  if (!content.includes('useProductFilter(products)')) {
    content = content.replace(
      'const [products, setProducts] = useState([]);',
      'const [products, setProducts] = useState([]);\n  const displayedProducts = useProductFilter(products);'
    );
    changed = true;
  }

  // Replace usage of products.length
  if (content.includes('products.length}')) {
    content = content.replace(/products\.length\}/g, 'displayedProducts.length}');
    changed = true;
  }

  // Replace products.map
  if (content.includes('products.map(')) {
    content = content.replace(/products\.map\(/g, 'displayedProducts.map(');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    modifiedCount++;
  }
});

console.log('Modified ' + modifiedCount + ' files.');
