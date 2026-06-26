import React, { useState, useRef, useEffect } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useSearchParams, Link } from "react-router-dom";
import { COLLECTIONS } from "../admin/constants";

// Filter Data
const filterData = {
  Colour: ["Azul", "Beige", "Black", "Blue", "Bronze", "Brown", "Dark Grey", "Grey", "Metallic Brown", "White"],
  Collections: COLLECTIONS,
  "Tile Use": [
    "Bathroom Wall", "Wall Tile", "Kitchen Wall", "Backsplash", 
    "Shower Wall", "Outdoor Wall", "Floor Tile", "Kitchen Floor", 
    "Bathroom Floor", "Commercial Floor", "Shower Floor", "Outdoor Floor", "Pool Tile"
  ],
  Style: [
    "Contemporary", "Modern", "Traditional", "Industrial", "Transitional", 
    "Mid Century", "Craftsman", "Mediterranean", "Beach", "Farmhouse", 
    "Classic", "Cottage", "Rustic", "Art Deco", "Tropical", "Whimsical", "Spanish Revival"
  ],
  Materials: [
    "Ceramic", "Porcelain", "Natural Stone", "Glass", "Metal", "Cement"
  ],
  Size: [
    "1\"", "1\" Hex", "1\" Penny Round", "1.5x4\" Herringbone", "1.5x4\" Stacked", "1.5x9\"", "1x1\"", "1x2\"", "1x3\"", "1x4\"", "1x5\" Herringbone", "1x6\"", "2\" Hex", "2.5x10\"", "2x2\"", "2x7\" Fish Scale", "2x8\"", "2x9\"", "2x10\"", "2x18\"", "2x20\"", "3\"", "3\" Hex", "3x3\"", "3x4\"", "3x6\"", "3x8\"", "3x9\"", "3x10\"", "3x11\"", "3x12\"", "3x16\"", "3x18\"", "4\"", "4\" Triangle", "4.5\" Hex", "4.5x18\"", "4x4\"", "4x5\"", "4x8\"", "4x8\" & 4x4\"", "4x12\"", "4x16\"", "4x19\"", "4x21\"", "4x24\"", "4x32\"", "4x36\"", "5\"", "5x5\"", "5x5\" Checkerboard", "5x5\" Deco", "5x8\"", "5x8\" Cruz", "5x10\"", "5x12\"", "5x16\"", "5x18\"", "6\"", "6x6\"", "6x6\" & 3x8\"", "6x7\"", "6x10\"", "6x12\"", "6x16\"", "6x24\"", "7\" Hex", "7x7\"", "7x14\"", "7x60\"", "8\" Hex", "8x8\"", "8x10\"", "8x16\"", "8x24\"", "8x32\"", "8x36\"", "8x48\"", "9\" Hex", "9x9\"", "9x36\"", "10\" Hex", "10x40\"", "12.5\"", "12x12\"", "12x24\"", "12x32\"", "12x36\"", "12x48\"", "14x14\"", "16x32\"", "16x48\"", "18x18\"", "18x26\"", "18x36\"", "18x48\"", "20\" Hex", "24x24\"", "24x48\"", "30x30\"", "30x60\"", "32x32\"", "36x36\"", "48x48\"", "60x120\"", "Fish Scale", "Flagstone", "Foliage", "French Pattern", "Mosaic", "Organic Mosaic", "Thin Strip"
  ],
  Mosaici: [
    "20.5x20.8 cm",
    "21.1x21.1 cm",
    "25.8x29.8 cm",
    "26.5x34.5 cm",
    "28.3x30.5 cm",
    "29.4x29.8 cm",
    "29.9x34.6 cm",
    "29x30",
    "30.1x29.8 cm",
    "30.5x23.5 cm",
    "30x26 cm",
    "30x30",
    "30x30 cm",
    "31.1x37.7",
    "31x25.5 cm",
    "34.6x30 cm",
    "38x38 cm",
    "45.8x16.2 cm",
    "Alpi Bronze Topaz"
  ],
  Look: [
    "Stone Look", "Marble Look", "Handmade Look", "Decorative Look", "Concrete Look", 
    "Encaustic Look", "Solid Color", "3D", "Terracotta Look", "Wood Look", "Subway Tile", 
    "Terrazzo Look", "Travertine Look", "Textured Look", "Fabric Look", "Metallic Look", 
    "Limestone Look", "Checkerboard", "Beveled", "Flagstone Look"
  ],
  Shape: [
    "Chevron", "Herringbone", "Hexagon", "Pickets", "Planks", "Rectangle", "Rhombus", 
    "Square", "Trapezium", "Triangle", "Woven Square"
  ],
  Finish: [
    "Matte", "Polished", "Mixed Finishes", "Semi-Polished", "Crackled", "Textured", "Satin"
  ]
};

function FilterDropdown({ label, options, selectedValues, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-centerx gap-1.5 px-3 h-[26px] py-0 border rounded-full text-xs font-medium leading-none transition-colors ${
          isOpen || selectedValues.length > 0 ? "bg-gray-100 border-gray-500 text-gray-900" : "bg-white border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50"
        }`}
      >
        <span>{label} {selectedValues.length > 0 && `(${selectedValues.length})`}</span>
        <HiOutlineChevronDown className={`text-gray-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && options && (
        <div className="absolute top-full mt-2 left-0 w-64 max-h-[300px] overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl z-50 p-2 custom-scrollbar">
          <ul className="list-none p-0 m-0">
            {options.map((opt, idx) => (
              <li key={idx}>
                <label className="flex items-center gap-2 px-3 py-1 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedValues.includes(opt)}
                    onChange={() => onChange(opt)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                  />
                  <span className="text-xs text-gray-700 flex-1">{opt}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ShopFilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (label, value) => {
    const newParams = new URLSearchParams(searchParams);
    const existing = newParams.getAll(label);
    if (existing.includes(value)) {
        const filtered = existing.filter(v => v !== value);
        newParams.delete(label);
        filtered.forEach(v => newParams.append(label, v));
    } else {
        newParams.append(label, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="sticky top-0 md:top-[90px] z-[40] bg-[#DBDBDB] border-b border-gray-300 shadow-sm transition-all duration-300 py-2 flex items-center">
      <div className="max-w-[1400px] w-full mx-auto px-6">
        <div className="flex flex-wrap items-center gap-2 w-full">
          
          <Link 
            to="/collections" 
            className="flex items-center justify-center gap-1.5 px-3.5 h-[26px] py-0 border border-gray-300 rounded-full text-xs font-bold leading-none bg-white text-gray-700 hover:border-gray-900 hover:bg-gray-50 no-underline transition-colors whitespace-nowrap cursor-pointer"
          >
            All Collections
          </Link>
          {Object.keys(filterData).map((category) => (
            <FilterDropdown 
              key={category}
              label={category} 
              options={filterData[category]} 
              selectedValues={searchParams.getAll(category)}
              onChange={(val) => handleFilterChange(category, val)}
            />
          ))}
          <button 
            onClick={() => setSearchParams(new URLSearchParams())} 
            className="flex items-center justify-center h-[26px] py-0 px-3 bg-transparent text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>


          
        </div>
      </div>
    </div>
  );
}
