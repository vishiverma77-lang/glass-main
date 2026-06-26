import fs from 'fs';
import path from 'path';

const pagesDir = './src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('ShopBy') && f.endsWith('.jsx'));

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has setProducts
  if (content.includes('setProducts(') && !content.includes('dummyProducts') && !content.includes('concreteProducts')) {
      console.log(`⏩ Skipping ${file} (already using backend fetch)`);
      return;
  }

  // Find component name
  const match = content.match(/export default function (ShopBy[A-Za-z0-9_]+)\s*\(/);
  if (!match) return;
  const compName = match[1];

  let category = compName.replace('ShopBy', '');
  // Format categorical strings (e.g. PreciousMetal -> Precious Metal)
  category = category.replace(/([A-Z])/g, ' $1').trim();

  // Make sure React is imported with hooks
  if (!content.includes('useState')) {
    content = content.replace(/import React(.*?)\s*from\s*['"]react['"];/, "import React, { useEffect, useState } from \"react\";");
  }

  // Guess the main array variable name by finding `.length` near `Results` or from `.map(`
  let arrayNameMatch = content.match(/\{([a-zA-Z0-9_]+)\.length\}\s*Results/);
  let arrayName = 'products'; // Fallback
  if (arrayNameMatch && arrayNameMatch[1] !== 'products') {
    arrayName = arrayNameMatch[1];
  } else {
    let mapMatch = content.match(/\{([a-zA-Z0-9_]+)\.map\s*\(/);
    if (mapMatch && mapMatch[1] !== 'products') {
      arrayName = mapMatch[1];
    }
  }

  // Replace array occurrences in JSX with 'products'
  if (arrayName !== 'products') {
    content = content.replace(new RegExp(`${arrayName}\\.length`, 'g'), `products.length`);
    content = content.replace(new RegExp(`${arrayName}\\.map`, 'g'), `products.map`);
    
    // Attempt dangerous but usually successful replacement of the array const
    // Match: const dummyProducts = [ ... ];
    const arrayRegex = new RegExp(`const\\s+${arrayName}\\s*=\\s*\\[[\\s\\S]*?\\];`);
    content = content.replace(arrayRegex, '');
  }

  // Remove old useEffect for scrollTo
  const oldEffectRegex = /useEffect\s*\(\s*\(\)\s*=>\s*\{\s*(?:\/\/.*?\s*)*window\.scrollTo\([^\)]+\);\s*\}\s*,\s*\[\]\s*\);/;
  content = content.replace(oldEffectRegex, '');

  // Inject our fetch logic right right after the component declaration
  const componentDeclRegex = new RegExp(`export default function ${compName}\\s*\\([^{]*\\)\\s*\\{`);
  
  const fetchLogic = `export default function ${compName}() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const res = await fetch(\`http://localhost:5000/api/products?search=${encodeURIComponent(category)}\`);
        const data = await res.json();
        
        const formatted = data.map((item, index) => ({
          id: item._id || index,
          image: item.images && item.images.length > 0 ? \`http://localhost:5000\${item.images[0]}\` : "/products/default.jpg",
          likes: item.likes || "0",
          colors: item.colors || [],
          brand: item.brand || "CERAGRES",
          title: item.name,
          price: item.price,
          rating: item.rating || "5.0",
          reviews: item.reviews || "0"
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);`;

  content = content.replace(componentDeclRegex, fetchLogic);

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Updated ${file} to fetch '${category}' products`);
  updatedCount++;
});

console.log("Successfully migrated " + updatedCount + " Category Pages to use Backend API.");
