const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('ShopBy') && f.endsWith('.jsx') && f !== 'ShopByConcrete.jsx');

const dummyArray = `
import ProductCard from "../components/ProductCard";

const dummyProducts = [
  {
    id: 1,
    image: "/products/Arizona Roble 12x48.jpg",
    likes: "4798",
    colors: ["#c5c0b6", "#a69f93", "#5c5c5c"],
    brand: "ARIZONA",
    title: "Arizona Roble 12x48 Porcelain Tile",
    price: "9.95",
    rating: "4.9",
    reviews: "49"
  },
  {
    id: 2,
    image: "/products/Arizona Roble 2x2.jpg",
    likes: "1400",
    colors: ["#899e84", "#cfd2ce", "#b4987a", "#a24726"],
    brand: "ARIZONA",
    title: "Arizona Roble 2x2 Mosaic Tile",
    price: "23.95",
    rating: "5.0",
    reviews: "11"
  },
  {
    id: 3,
    image: "/products/Arizona Roble 4x2.jpg",
    likes: "1000",
    colors: ["#515764", "#7b818f", "#d7d7d7", "#cca68f"],
    brand: "ARIZONA",
    title: "Arizona Roble 4x2 Wall Tile",
    price: "14.99",
    rating: "5.0",
    reviews: "21"
  },
  {
    id: 4,
    image: "/products/Arizona Roble Chevron.jpg",
    likes: "320",
    colors: ["#dcdcdc", "#ababab"],
    brand: "ARIZONA",
    title: "Arizona Roble Chevron Pattern Tile",
    price: "7.49",
    rating: "4.7",
    reviews: "88"
  },
  {
    id: 5,
    image: "/products/Arizona Roble Hexagon.jpg",
    likes: "850",
    colors: ["#585858", "#9c9c9c", "#e7e7e7"],
    brand: "ARIZONA",
    title: "Arizona Roble Hexagon Floor Tile",
    price: "6.95",
    rating: "4.8",
    reviews: "102"
  }
];
`;

const replaceGrid = `      <ShopFilterBar />

      <div className="max-w-[1400px] mx-auto px-6 mt-12 mb-20 bg-white">
        {/* Top options controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-[#2a2a2a]">{dummyProducts.length} Results</h2>
          <div className="w-full sm:w-auto">
             <select className="w-full sm:w-64 border border-gray-300 rounded-sm px-4 py-2 text-sm text-[#2a2a2a] font-medium outline-none focus:border-gray-500 bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
              <option>New Arrivals</option>
            </select>
          </div>
        </div>

        {/* The Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {dummyProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="mt-16 flex justify-center">
            <button className="px-10 py-3 border-2 border-gray-900 text-gray-900 font-bold tracking-widest text-sm hover:bg-gray-900 hover:text-white transition-colors duration-300 uppercase">
                Load More Products
            </button>
        </div>
      </div>

    </div>
  );
}
`;

let count = 0;
files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already processed to be safe
  if (content.includes('ProductCard key={product.id}')) return;

  // Replace imports/arrays
  if (content.includes('import ShopFilterBar')) {
      content = content.replace(
        'import ShopFilterBar from "../components/ShopFilterBar";',
        'import ShopFilterBar from "../components/ShopFilterBar";' + dummyArray
      );
  }

  // Use a generic string replace for the end tag to insert the grid
  // In the generated files, they end with:
  //       <ShopFilterBar />
  //     </div>
  //   );
  // }
  
  const targetEnd = `      <ShopFilterBar />
    </div>
  );
}`;
  
  if (content.includes(targetEnd)) {
      content = content.replace(
          targetEnd,
          replaceGrid
      );
      count++;
  } else {
      // Fallback regex if precise string matching fails because of whitespace/newlines
      content = content.replace(
        /      <ShopFilterBar \/>\s*<\/div>\s*\);\s*}\s*$/,
        replaceGrid
      );
      count++;
  }

  fs.writeFileSync(filePath, content);
});

console.log("Applied grid design to " + count + " files.");
