const fs = require('fs');
const path = require('path');

const formats = ["Small", "Medium", "Large", "Slabs", "Planks", "Stripes", "Chevron", "Hexagon"];
const colours = ["Beige", "Brown", "White", "Black", "Light Grey", "Dark Grey", "Blue"];
const collections = ["Absolute", "Alpi", "Always", "Alchimia", "Arizona", "B&W", "Brooklyn", "Brush", "Calabria", "Cerdisa", "Chalet", "Channel", "Chester", "Chelsea", "Cimone", "Cromatica", "Core", "Corten", "Denver", "Esprit", "Etruria", "Externa", "Fidenza", "Fresco", "Gatsby", "Heritage", "Imperia", "Kemberg", "Laverton", "Linea Oro", "Linea Plata", "Mashup", "Motion", "Noon", "Oregon", "Oxford", "Page", "Palmaria", "Policroma", "Poudre", "Privilige", "Rift", "Seattle", "Serpal", "Spazzio", "Specchio Oro", "Spruzza Oro", "Stream", "Walks", "Weekend"];

function generateComponentName(name) {
  let cleanName = name.replace(/&/g, 'And').replace(/ /g, '');
  return `ShopBy${cleanName}`;
}

function generateRoutePath(groupContext, name) {
  let urlName = name.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-');
  return `/${groupContext}/${urlName}`;
}

const pagesDir = path.join(__dirname, 'src', 'pages');

function createFiles(items, groupType) {
  items.forEach(item => {
    const compName = generateComponentName(item);
    const content = `import React, { useEffect } from "react";
import ShopFilterBar from "../components/ShopFilterBar";

export default function ${compName}() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="flex flex-col md:flex-row w-full max-w-[1400px] mx-auto mt-6 mb-12">
        <div className="w-full md:w-1/2 bg-[#faf9f8] p-10 md:p-16 lg:p-24 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight leading-tight mb-6 uppercase">
            SHOP BY <br className="hidden md:block"/> ${item.toUpperCase()}
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg">
            Explore our exquisite selection of <span className="text-blue-600 font-medium lowercase">${item.toLowerCase()}</span> ${groupType}s, where each piece is 
            thoughtfully curated to elevate your space. From contemporary to artisan designs, 
            our handpicked assortment offers timeless elegance and modern flair. Let us
            guide you in finding the perfect tile that balances approachable luxury with high-touch service.
          </p>
        </div>
        <div className="w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1400&auto=format&fit=crop" 
            alt="${item} Tile Arrangement" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <ShopFilterBar />
    </div>
  );
}
`;
    fs.writeFileSync(path.join(pagesDir, `${compName}.jsx`), content);
  });
}

createFiles(formats, "format");
createFiles(colours, "colour");
createFiles(collections, "collection");

const appPath = path.join(__dirname, 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

let imports = [];
let routes = [];

const allGroups = [
  { items: formats, context: "format" },
  { items: colours, context: "colour" },
  { items: collections, context: "collection" }
];

allGroups.forEach(g => {
  g.items.forEach(item => {
    const compName = generateComponentName(item);
    const routePath = generateRoutePath(g.context, item);
    imports.push(`import ${compName} from "./pages/${compName}";`);
    routes.push(`          <Route path="${routePath}" element={<${compName} />} />`);
  });
});

appContent = appContent.replace(/import ShopByFormats from "\.\/pages\/ShopByFormats";\n/g, "");
appContent = appContent.replace(/import ShopByColours from "\.\/pages\/ShopByColours";\n/g, "");
appContent = appContent.replace(/import ShopByCollections from "\.\/pages\/ShopByCollections";\n/g, "");

appContent = appContent.replace(
  'import ShopByCarpet from "./pages/ShopByCarpet";',
  'import ShopByCarpet from "./pages/ShopByCarpet";\n' + imports.join('\n')
);

// We need to account for varying whitespace in App.jsx when replacing
appContent = appContent.replace(/\s*<Route path="\/group\/formats".*\n/g, "\n");
appContent = appContent.replace(/\s*<Route path="\/group\/colours".*\n/g, "\n");
appContent = appContent.replace(/\s*<Route path="\/group\/collections".*\n/g, "\n");

appContent = appContent.replace(
  '<Route path="/effect/carpet" element={<ShopByCarpet />} />',
  '<Route path="/effect/carpet" element={<ShopByCarpet />} />\n' + routes.join('\n')
);

fs.writeFileSync(appPath, appContent);
console.log("Pages generated and App.jsx updated successfully.");
