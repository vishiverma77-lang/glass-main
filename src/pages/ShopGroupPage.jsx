import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// Hardcoded groupings based on TopNavbar for fast visual display
const categoryGroups = {
  effects: {
    title: "Shop By Effects",
    description: "Explore our stunning surface textures and visual effects to find the perfect style for your space.",
    items: ["Concrete", "Stone", "Wood", "Marble", "Metal", "Contemporary", "Precious Metal", "Artisan", "Carpet"]
  },
  formats: {
    title: "Shop By Formats",
    description: "From small mosaics to large slabs, discover tiles in various shapes and sizes.",
    items: ["Small", "Medium", "Large", "Slabs", "Planks", "Stripes", "Chevron", "Hexagon"]
  },
  colours: {
    title: "Shop By Colours",
    description: "Find the exact shade you're looking for with our color-coordinated collections.",
    items: ["Beige", "Brown", "White", "Black", "Light Grey", "Dark Grey", "Blue"]
  },
  collections: {
    title: "Shop By Collections",
    description: "Browse our exclusive product collections designed for unified aesthetics.",
    items: ["Absolute", "Alpi", "Always", "Alchimia", "Arizona", "B&W", "Brooklyn", "Brush", "Calabria", "Cerdisa", "Chalet", "Channel", "Chester", "Chelsea", "Cimone", "Cromatica", "Core", "Corten", "Denver", "Esprit", "Etruria", "Externa", "Fidenza", "Fresco", "Gatsby", "Heritage", "Imperia", "Kemberg", "Laverton", "Linea Oro", "Linea Plata", "Mashup", "Motion", "Noon", "Oregon", "Oxford", "Page", "Palmaria", "Policroma", "Poudre", "Privilige", "Rift", "Seattle", "Serpal", "Spazzio", "Specchio Oro", "Spruzza Oro", "Stream", "Walks", "Weekend"]
  }
};

export default function ShopGroupPage() {
  const { groupName } = useParams();
  
  // Find the matching group or default to a safe one
  const groupKey = groupName?.toLowerCase().replace(/ |-/g, '');
  
  // Try to match the key (e.g., 'shopbyeffects' or 'effects' directly)
  let activeGroup = null;
  if (groupKey?.includes('effects')) activeGroup = categoryGroups.effects;
  else if (groupKey?.includes('formats')) activeGroup = categoryGroups.formats;
  else if (groupKey?.includes('colours')) activeGroup = categoryGroups.colours;
  else if (groupKey?.includes('collections')) activeGroup = categoryGroups.collections;

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [groupName]);

  if (!activeGroup) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Category Not Found</h2>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-[#00264b] text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{activeGroup.title}</h1>
        <p className="max-w-2xl mx-auto text-blue-100 text-lg">{activeGroup.description}</p>
      </div>

      {/* Grid of items */}
      <div className="max-w-[1400px] mx-auto px-6 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {activeGroup.items.map((item, idx) => {
            const linkPath = `/category/${item.toLowerCase().replace(/ \/ | /g, '-')}`;
            return (
              <Link
                key={idx}
                to={linkPath}
                className="group flex flex-col items-center p-6 bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline rounded-xl"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <span className="font-bold text-xl">{item.charAt(0)}</span>
                </div>
                <h3 className="text-gray-900 font-bold text-center text-sm md:text-base group-hover:text-blue-600 transition-colors">
                  {item}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
