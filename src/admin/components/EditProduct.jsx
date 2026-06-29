import React, { useState } from "react";
import TileLoader from "../../components/TileLoader";
import { COLLECTIONS } from "../constants";
import { getImageUrl } from "../../utils/imageUtils";

const AVAILABLE_SHAPES = [
  "Chevron", "Herringbone", "Hexagon", "Pickets", "Planks", 
  "Rectangle", "Rhombus", "Square", "Trapezium", "Triangle", "Woven Square"
];

const AVAILABLE_COLOURS = [
  "Azul", "Beige", "Black", "Blue", "Bronze", "Brown", "Dark Grey", "Grey", "Metallic Brown", "White"
];

const AVAILABLE_MOSAICI = [
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
];

const DEFAULT_ATTRIBUTES = {
  effects: [],
  formats: [],
  tileUses: ["Bathroom Wall", "Outdoor Wall", "Kitchen Wall", "Wall Tile", "Backsplash", "Shower Wall", "Kitchen Floor", "Floor Tile", "Bathroom Floor", "Commercial Floor", "Outdoor Floor", "Shower Floor", "Pool Tile"],
  styles: ["Traditional", "Contemporary", "Rustic", "Modern", "Transitional", "Industrial", "Classic", "Mediterranean", "Mid Century", "Farmhouse", "Craftsman", "Beach", "Cottage", "Tropical", "Art Deco", "Whimsical", "Spanish Revival"],
  materials: ["Ceramic & Porcelain", "Porcelain", "Stone", "Marble", "Glass", "Ceramic", "Terrazzo", "Pebble Tile", "Terracotta", "Lava Stone", "Clay Brick", "Cement"],
  looks: ["Stone Look", "Decorative Look", "Marble Look", "Concrete Look", "Solid Color", "Wood Look", "3D", "Subway Tile"],
  finishes: []
};

const MultiSelectGroup = ({ title, attrKey, options, selected, toggleSelection, allowCustom, customVal, setCustomVal, onAddCustom, onDeleteCustom }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      <label className="block text-sm font-extrabold text-slate-800 mb-4 tracking-wide uppercase">{title}</label>
      <div className="flex flex-wrap items-center gap-3">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          const isDefault = DEFAULT_ATTRIBUTES[attrKey]?.includes(opt);
          return (
            <button 
              type="button" 
              key={opt}
              onClick={() => toggleSelection(opt)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isSelected 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <span>{opt}</span>
              {!isDefault && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustom(opt);
                  }}
                  className={`ml-1 font-extrabold cursor-pointer text-[9px] lowercase rounded-full w-3.5 h-3.5 inline-flex items-center justify-center border-none transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white hover:bg-white/40'
                      : 'bg-slate-200 text-slate-500 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  ✕
                </span>
              )}
            </button>
          );
        })}
        {allowCustom && (
          <div className="flex items-center gap-2 mt-2 w-full sm:w-auto">
             <input 
               type="text" 
               value={customVal} 
               onChange={(e) => setCustomVal(e.target.value)} 
               onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   e.preventDefault();
                   onAddCustom();
                 }
               }}
               placeholder="Type custom & press Enter" 
               className="px-4 py-2 text-xs border border-slate-300 rounded-full outline-none focus:border-blue-500 font-semibold text-slate-800 shadow-sm w-48"
             />
             <button 
               type="button" 
               onClick={onAddCustom} 
               className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-full hover:bg-black transition-colors shadow-md"
             >
               Add
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EditProduct = ({ product, onCancel, onSuccess }) => {
  const [showColorsShapes, setShowColorsShapes] = useState({});
  const [name, setName] = useState(product.name || "");

  const [availableColours, setAvailableColours] = useState([]);
  const [availableShapes, setAvailableShapes] = useState([]);
  const [availableMosaici, setAvailableMosaici] = useState([]);
  const [newColorInput, setNewColorInput] = useState("");
  const [newShapeInput, setNewShapeInput] = useState("");
  const [newMosaiciInput, setNewMosaiciInput] = useState("");
  const [availableEffects, setAvailableEffects] = useState([]);
  const [availableFormats, setAvailableFormats] = useState([]);
  const [availableFinishes, setAvailableFinishes] = useState([]);
  const [newEffectInput, setNewEffectInput] = useState("");
  const [newFormatInput, setNewFormatInput] = useState("");
  const [newFinishInput, setNewFinishInput] = useState("");

  const [dbAttributes, setDbAttributes] = useState({
    colors: [],
    effects: [],
    formats: [],
    tileUses: ["Bathroom Wall", "Outdoor Wall", "Kitchen Wall", "Wall Tile", "Backsplash", "Shower Wall", "Kitchen Floor", "Floor Tile", "Bathroom Floor", "Commercial Floor", "Outdoor Floor", "Shower Floor", "Pool Tile"],
    styles: ["Traditional", "Contemporary", "Rustic", "Modern", "Transitional", "Industrial", "Classic", "Mediterranean", "Mid Century", "Farmhouse", "Craftsman", "Beach", "Cottage", "Tropical", "Art Deco", "Whimsical", "Spanish Revival"],
    materials: ["Ceramic & Porcelain", "Porcelain", "Stone", "Marble", "Glass", "Ceramic", "Terrazzo", "Pebble Tile", "Terracotta", "Lava Stone", "Clay Brick", "Cement"],
    looks: ["Stone Look", "Decorative Look", "Marble Look", "Concrete Look", "Solid Color", "Wood Look", "3D", "Subway Tile"],
    finishes: []
  });

  React.useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes`);
        if (res.ok) {
          const data = await res.json();
          setDbAttributes(prev => ({ ...prev, ...data }));
          setAvailableColours(data.colors || []);
          setAvailableShapes(data.shapes || []);
          setAvailableMosaici(data.mosaici || []);
          setAvailableEffects(data.effects || []);
          setAvailableFormats(data.formats || []);
          setAvailableFinishes(data.finishes || []);
        }
      } catch (err) {
        console.error("Error fetching attributes:", err);
      }
    };
    fetchAttributes();
  }, []);

  const handleAddColorAttribute = async () => {
    const val = newColorInput.trim();
    if (!val) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/colors/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableColours(data.values);
        setNewColorInput("");
      }
    } catch (err) {
      console.error("Error adding color:", err);
    }
  };

  const handleAddShapeAttribute = async () => {
    const val = newShapeInput.trim();
    if (!val) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/shapes/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableShapes(data.values);
        setNewShapeInput("");
      }
    } catch (err) {
      console.error("Error adding shape:", err);
    }
  };

  const handleAddEffectAttribute = async () => {
    const val = newEffectInput.trim();
    if (!val) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/effects/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableEffects(data.values);
        setNewEffectInput("");
      }
    } catch (err) {
      console.error("Error adding effect:", err);
    }
  };

  const handleAddFormatAttribute = async () => {
    const val = newFormatInput.trim();
    if (!val) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/formats/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableFormats(data.values);
        setNewFormatInput("");
      }
    } catch (err) {
      console.error("Error adding format:", err);
    }
  };

  const handleAddFinishAttribute = async () => {
    const val = newFinishInput.trim();
    if (!val) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/finishes/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableFinishes(data.values);
        setNewFinishInput("");
      }
    } catch (err) {
      console.error("Error adding finish:", err);
    }
  };

  const handleDeleteColorAttribute = async (val) => {
    if (!window.confirm(`Delete color "${val}"?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/colors/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableColours(data.values);
      }
    } catch (err) {
      console.error("Error deleting color:", err);
    }
  };

  const handleDeleteShapeAttribute = async (val) => {
    if (!window.confirm(`Delete shape "${val}"?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/shapes/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableShapes(data.values);
      }
    } catch (err) {
      console.error("Error deleting shape:", err);
    }
  };

  const handleDeleteEffectAttribute = async (val) => {
    if (!window.confirm(`Delete effect "${val}"?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/effects/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableEffects(data.values);
      }
    } catch (err) {
      console.error("Error deleting effect:", err);
    }
  };

  const handleDeleteFormatAttribute = async (val) => {
    if (!window.confirm(`Delete format "${val}"?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/formats/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableFormats(data.values);
      }
    } catch (err) {
      console.error("Error deleting format:", err);
    }
  };

  const handleDeleteFinishAttribute = async (val) => {
    if (!window.confirm(`Delete finish "${val}"?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/finishes/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableFinishes(data.values);
      }
    } catch (err) {
      console.error("Error deleting finish:", err);
    }
  };

  const handleAddMosaiciAttribute = async () => {
    const val = newMosaiciInput.trim();
    if (!val) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/mosaici/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableMosaici(data.values);
        setNewMosaiciInput("");
      }
    } catch (err) {
      console.error("Error adding mosaici:", err);
    }
  };

  const handleDeleteMosaiciAttribute = async (val) => {
    if (!window.confirm(`Delete mosaici option "${val}"?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/mosaici/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableMosaici(data.values);
      }
    } catch (err) {
      console.error("Error deleting mosaici:", err);
    }
  };
  const [sku, setSku] = useState(product.sku || "");
  const [pricePerSqft, setPricePerSqft] = useState(product.pricePerSqft || "");
  const [sqftPerBox, setSqftPerBox] = useState(product.sqftPerBox || "");
  const [pricingUnit, setPricingUnit] = useState(product.pricingUnit || "Box");
  const [price, setPrice] = useState(product.price || "");
  const [description, setDescription] = useState(product.description || "");
  const [series, setSeries] = useState(product.series || "");
  const [variationColors, setVariationColors] = useState(() => {
    if (Array.isArray(product.variationColors) && product.variationColors.length > 0) {
      return product.variationColors.map(c => {
          if (typeof c === 'string') return { name: c, image: "", preview: null, file: null };
          return { name: c.name, image: c.image, preview: getImageUrl(c.image), file: null };
      });
    }
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.map(c => ({ name: c, image: "", preview: null, file: null }));
    }
    return [];
  });

  const [colorInput, setColorInput] = useState("");



  
  // Array of 8 items containing either string (path) or File object.
  const initialImages = Array(8).fill(null);
  if (product.images) {
      for(let i=0; i<product.images.length && i<8; i++) {
          initialImages[i] = product.images[i];
      }
  }
  const [images, setImages] = useState(initialImages);

  // Video State
  const [existingVideo, setExistingVideo] = useState(product.video || null);
  const [video, setVideo] = useState(null);

  // 360 View State
  const [existing360, setExisting360] = useState(product.images360 || []);
  const [new360, setNew360] = useState([]);

  const handleImages360Change = (e) => {
    const files = Array.from(e.target.files);
    setNew360([...new360, ...files]);
  };

  const removeExisting360 = (index) => {
    setExisting360(existing360.filter((_, i) => i !== index));
  };

  const removeNew360 = (index) => {
    setNew360(new360.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);
    setExistingVideo(null); // Clear existing preview if user selects new file
  };
  
  const removeVideo = () => {
    setVideo(null);
    setExistingVideo(null);
  };

  // ─── Color Options State ──────────────────────────────────────────────────
  // Each option: { color: string, existingImages: [string], newImages: [File|null x8], previews: [string|null x8] }
  const initColorOptions = () => {
    const safeOpts = Array.isArray(product.colorOptions) ? product.colorOptions : [];
    return safeOpts.map(opt => ({
      color: opt.color || "",
      sku: opt.sku || "",
      name: opt.name || "",
      productName: opt.productName || "",
      price: opt.price || "",
      pricePerSqft: opt.pricePerSqft || "",
      sqftPerBox: opt.sqftPerBox || "",
      pricingUnit: opt.pricingUnit || "Box",
      sizes: opt.sizes || [],
      mosaici: opt.mosaici || [],
      effects: opt.effects || [],
      finishes: opt.finishes || [],
      formats: opt.formats || [],
      description: opt.description || "",
      existingImages: Array.isArray(opt.images) ? [...opt.images] : [],
      newImages: Array(8).fill(null),
      previews: Array(8).fill(null),
      existingVideo: opt.video || null,
      video: null,
      existingThumbnail: opt.thumbnail || null,
      thumbnail: null,
      thumbnailPreview: null,
      existingImages360: Array.isArray(opt.images360) ? [...opt.images360] : [],
      newImages360: [],
      images360: []
    }));
  };
  const [colorOptions, setColorOptions] = useState(initColorOptions);

  const safeArray = (arr) => Array.isArray(arr) ? arr : [];
  const [effects, setEffects] = useState(safeArray(product.effects));
  const [formats, setFormats] = useState(safeArray(product.formats));
  const [colors, setColors] = useState(safeArray(product.colors));
  const [tileUses, setTileUses] = useState(safeArray(product.tileUses));
  const [styles, setStyles] = useState(safeArray(product.styles));
  const [materials, setMaterials] = useState(safeArray(product.materials));
  const [looks, setLooks] = useState(safeArray(product.looks));
  const [finishes, setFinishes] = useState(safeArray(product.finishes));

  const EFFECTS = Array.from(new Set([...DEFAULT_ATTRIBUTES.effects, ...(dbAttributes.effects || [])]));
  const FORMATS = Array.from(new Set([...DEFAULT_ATTRIBUTES.formats, ...(dbAttributes.formats || [])]));
  const COLORS = dbAttributes.colors;
  const TILEUSES = Array.from(new Set([...DEFAULT_ATTRIBUTES.tileUses, ...(dbAttributes.tileUses || [])]));
  const STYLES = Array.from(new Set([...DEFAULT_ATTRIBUTES.styles, ...(dbAttributes.styles || [])]));
  const MATERIALS = Array.from(new Set([...DEFAULT_ATTRIBUTES.materials, ...(dbAttributes.materials || [])]));
  const LOOKS = Array.from(new Set([...DEFAULT_ATTRIBUTES.looks, ...(dbAttributes.looks || [])]));
  const FINISHES = Array.from(new Set([...DEFAULT_ATTRIBUTES.finishes, ...(dbAttributes.finishes || [])]));
  
  const customColorsFromProduct = safeArray(product.colors).filter(c => !COLORS.includes(c));
  const [colorsList, setColorsList] = useState([...COLORS, ...customColorsFromProduct]);
  
  React.useEffect(() => {
    const currentCustoms = safeArray(product.colors).filter(c => !COLORS.includes(c));
    setColorsList([...COLORS, ...currentCustoms]);
  }, [COLORS, product.colors]);

  const [customColor, setCustomColor] = useState("");
  const [customEffect, setCustomEffect] = useState("");
  const [customFormat, setCustomFormat] = useState("");
  const [customTileUse, setCustomTileUse] = useState("");
  const [customStyle, setCustomStyle] = useState("");
  const [customMaterial, setCustomMaterial] = useState("");
  const [customLook, setCustomLook] = useState("");
  const [customFinish, setCustomFinish] = useState("");

  const handleAddCustomAttribute = async (attrName, customVal, setCustomVal) => {
    const val = customVal.trim();
    if (!val) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/${attrName}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setDbAttributes(prev => ({
          ...prev,
          [attrName]: data.values
        }));
        setCustomVal("");

        // Automatically select the newly added custom value
        const formattedVal = val.charAt(0).toUpperCase() + val.slice(1);
        if (attrName === "effects") {
          setEffects(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (attrName === "formats") {
          setFormats(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (attrName === "tileUses") {
          setTileUses(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (attrName === "styles") {
          setStyles(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (attrName === "materials") {
          setMaterials(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (attrName === "looks") {
          setLooks(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (attrName === "finishes") {
          setFinishes(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        }
      } else {
        alert("Failed to add custom attribute value.");
      }
    } catch (err) {
      console.error("Error adding custom attribute:", err);
    }
  };

  const handleDeleteCustomAttribute = async (attrName, val) => {
    if (!window.confirm(`Delete "${val}" from ${attrName}?`)) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/${attrName}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setDbAttributes(prev => ({
          ...prev,
          [attrName]: data.values
        }));
        
        // Also remove from selected array if it was selected
        if (attrName === "effects") {
          setEffects(prev => prev.filter(v => v !== val));
        } else if (attrName === "formats") {
          setFormats(prev => prev.filter(v => v !== val));
        } else if (attrName === "tileUses") {
          setTileUses(prev => prev.filter(v => v !== val));
        } else if (attrName === "styles") {
          setStyles(prev => prev.filter(v => v !== val));
        } else if (attrName === "materials") {
          setMaterials(prev => prev.filter(v => v !== val));
        } else if (attrName === "looks") {
          setLooks(prev => prev.filter(v => v !== val));
        } else if (attrName === "finishes") {
          setFinishes(prev => prev.filter(v => v !== val));
        }
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete custom attribute value.");
      }
    } catch (err) {
      console.error("Error deleting custom attribute:", err);
    }
  };

  const handleToggle = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Sync variations when main pricing unit changes
  React.useEffect(() => {
    setColorOptions(prev => prev.map(opt => ({
      ...opt,
      pricingUnit: pricingUnit // Force sync all variations to main unit
    })));
  }, [pricingUnit]);

  const handlePriceSqftChange = (val) => {
      setPricePerSqft(val);
      if (val && sqftPerBox) {
          setPrice((parseFloat(val) * parseFloat(sqftPerBox)).toFixed(2));
      }
  };

  const handleSqftBoxChange = (val) => {
      setSqftPerBox(val);
      if (pricePerSqft && val) {
          setPrice((parseFloat(pricePerSqft) * parseFloat(val)).toFixed(2));
      }
  };



  const handleAddCustomColor = () => {
    if (customColor.trim() !== '') {
      if (!colorsList.includes(customColor.trim())) {
        setColorsList([...colorsList, customColor.trim()]);
      }
      if (!colors.includes(customColor.trim())) {
        setColors([...colors, customColor.trim()]);
      }
      setCustomColor("");
    }
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };
  
  const removeImage = (index) => {
      const newImages = [...images];
      newImages[index] = null;
      setImages(newImages);
  };

  // ─── Color Options Handlers ───────────────────────────────────────────────
  const handleAddColorOption = () => {
    setColorOptions([...colorOptions, {
      color: "",
      shapes: [],
      shape: "",
      mosaici: [],
      effects: [],
      formats: [],
      finishes: [],
      name: "",
      productName: "",
      price: "",
      pricePerSqft: "",
      sqftPerBox: "",
      pricingUnit: pricingUnit, // Inherit from main unit
      sizes: [],
      description: "",
      existingImages: [],
      newImages: Array(8).fill(null),
      previews: Array(8).fill(null),
      existingVideo: null,
      video: null,
      existingThumbnail: null,
      thumbnail: null,
      thumbnailPreview: null,
      existingImages360: [],
      newImages360: [],
      images360: []
    }]);
  };

  const handleRemoveColorOption = (idx) => {
    setColorOptions(colorOptions.filter((_, i) => i !== idx));
  };

  const handleColorFieldChange = (idx, field, val) => {
    const updated = [...colorOptions];
    updated[idx] = { ...updated[idx], [field]: val };
    setColorOptions(updated);
  };

  const handleRemoveExistingColorImage = (optIdx, imgIdx) => {
    const updated = [...colorOptions];
    updated[optIdx] = {
      ...updated[optIdx],
      existingImages: updated[optIdx].existingImages.filter((_, i) => i !== imgIdx)
    };
    setColorOptions(updated);
  };

  const handleNewColorImageChange = (e, optIdx, slotIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...colorOptions];
    const newImgs = [...updated[optIdx].newImages];
    const previews = [...updated[optIdx].previews];
    newImgs[slotIdx] = file;
    previews[slotIdx] = URL.createObjectURL(file);
    updated[optIdx] = { ...updated[optIdx], newImages: newImgs, previews };
    setColorOptions(updated);
  };

  const handleRemoveNewColorImage = (optIdx, slotIdx) => {
    const updated = [...colorOptions];
    const newImgs = [...updated[optIdx].newImages];
    const previews = [...updated[optIdx].previews];
    newImgs[slotIdx] = null;
    previews[slotIdx] = null;
    updated[optIdx] = { ...updated[optIdx], newImages: newImgs, previews };
    setColorOptions(updated);
  };

  const handleColorVideoChange = (e, optIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...colorOptions];
    updated[optIdx] = { ...updated[optIdx], video: file, existingVideo: null };
    setColorOptions(updated);
  };

  const removeColorVideo = (optIdx) => {
    const updated = [...colorOptions];
    updated[optIdx] = { ...updated[optIdx], video: null, existingVideo: null };
    setColorOptions(updated);
  };

  const handleColorThumbnailChange = (e, optIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...colorOptions];
    updated[optIdx] = { 
      ...updated[optIdx], 
      thumbnail: file, 
      thumbnailPreview: URL.createObjectURL(file),
      existingThumbnail: null 
    };
    setColorOptions(updated);
  };

  const handleRemoveColorThumbnail = (optIdx) => {
    const updated = [...colorOptions];
    updated[optIdx] = { ...updated[optIdx], thumbnail: null, thumbnailPreview: null, existingThumbnail: null };
    setColorOptions(updated);
  };


  // ─── Submit ───────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const finalName = colorOptions.length > 0 ? (colorOptions[0].productName || colorOptions[0].name) : (name || series);

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", finalName || "Unnamed Product");
    formData.append("sku", sku);
    formData.append("pricingUnit", pricingUnit);
    formData.append("pricePerSqft", 0);
    formData.append("sqftPerBox", 0);
    formData.append("price", 0);
    formData.append("description", description);
    formData.append("series", series);
    formData.append("variationColors", JSON.stringify(variationColors.map(c => c.name)));

    const existingIcons = [];
    const uploadIndices = [];
    let uploadIdx = 0;
    variationColors.forEach(c => {
      if (c.file) {
        formData.append("variationColorImages", c.file);
        uploadIndices.push(uploadIdx++);
        existingIcons.push("");
      } else {
        uploadIndices.push(null);
        existingIcons.push(c.image || "");
      }
    });
    formData.append("existingVariationColorImages", JSON.stringify(existingIcons));
    formData.append("variationColorIndices", JSON.stringify(uploadIndices));




    formData.append("effects", JSON.stringify([]));
    formData.append("formats", JSON.stringify([]));
    formData.append("colors", JSON.stringify(colors));
    formData.append("tileUses", JSON.stringify(tileUses));
    formData.append("styles", JSON.stringify(styles));
    formData.append("materials", JSON.stringify(materials));
    formData.append("sizes", JSON.stringify([]));
    formData.append("looks", JSON.stringify(looks));
    formData.append("finishes", JSON.stringify([]));


    if (video) {
      formData.append("video", video);
    }
    formData.append("keepExistingVideo", existingVideo ? 'true' : 'false');

    // 360 Images
    formData.append("existingImages360", JSON.stringify(existing360));
    new360.forEach(file => formData.append("images360", file));
    formData.append("keepExisting360", (existing360.length > 0 || new360.length > 0) ? 'true' : 'false');

    // Main product images
    const existingMainImages = [];
    images.forEach((fileOrString) => {
      if (typeof fileOrString === 'string') {
        existingMainImages.push(fileOrString);
      } else if (fileOrString instanceof File) {
        formData.append("images", fileOrString); 
      }
    });
    formData.append("existingImages", JSON.stringify(existingMainImages));

    
    let allNewColorFiles = [];
    let allNewColorVideos = [];
    let allNewColorThumbnails = [];
    let allNewColorImages360Files = [];
    
    const colorOptionsPayload = colorOptions.map(opt => {
      const newFileIndices = [];
      opt.newImages.forEach(file => {
        if (file) {
          newFileIndices.push(allNewColorFiles.length);
          allNewColorFiles.push(file);
        }
      });

      let newVideoIndex = undefined;
      if (opt.video) {
        newVideoIndex = allNewColorVideos.length;
        allNewColorVideos.push(opt.video);
      }

      let newThumbnailIndex = undefined;
      if (opt.thumbnail) {
        newThumbnailIndex = allNewColorThumbnails.length;
        allNewColorThumbnails.push(opt.thumbnail);
      }

      const newImages360Indices = [];
      if (opt.newImages360 && opt.newImages360.length > 0) {
        opt.newImages360.forEach(file => {
          if (file) {
            newImages360Indices.push(allNewColorImages360Files.length);
            allNewColorImages360Files.push(file);
          }
        });
      }

      return {
        color: opt.color,
        sku: opt.sku,
        colors: opt.colors || (opt.color ? [opt.color] : []),
        shapes: opt.shapes || [],
        shape: opt.shape || "",
        mosaici: opt.mosaici || [],
        name: opt.name,
        productName: opt.productName || "",
        price: opt.price,
        pricePerSqft: opt.pricePerSqft,
        sqftPerBox: opt.sqftPerBox,
        pricingUnit: opt.pricingUnit || "Box",
        sizes: opt.sizes || [],
        effects: opt.effects || [],
        finishes: opt.finishes || [],
        formats: opt.formats || [],
        description: opt.description,
        existingImages: opt.existingImages,
        newFileIndices,
        existingThumbnail: opt.existingThumbnail,
        newThumbnailIndex,
        existingVideo: opt.existingVideo,
        newVideoIndex,
        keepExistingVideo: !!opt.existingVideo,
        existingImages360: opt.existingImages360,
        newImages360Indices
      };
    });

    formData.append("colorOptionsEdit", JSON.stringify(colorOptionsPayload));
    allNewColorFiles.forEach(file => formData.append("colorImages", file));
    allNewColorVideos.forEach(file => formData.append("colorVideos", file));
    allNewColorThumbnails.forEach(file => formData.append("colorThumbnails", file));
    allNewColorImages360Files.forEach(file => formData.append("colorImages360", file));

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        showToast('success', `"${name}" updated successfully! ✨`);
        setTimeout(() => { if(onSuccess) onSuccess(); }, 1500);
      } else {
        const errorData = await response.json();
        showToast('error', errorData.message || 'Failed to update product.');
      }
    } catch (err) {
      showToast('error', 'Could not connect to the Backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 relative">

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex flex-col items-center justify-center">
          <TileLoader />
          <p className="mt-6 text-white font-black text-lg uppercase tracking-widest animate-pulse">Updating Product...</p>
          <p className="text-white/50 font-medium text-sm mt-2">Saving changes to cloud ☁️</p>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[1000] flex items-start gap-4 px-6 py-5 rounded-2xl shadow-2xl min-w-[320px] max-w-[420px] ${
          toast.type === 'success' 
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
        }`}>
          <div className="text-3xl mt-0.5">{toast.type === 'success' ? '✅' : '❌'}</div>
          <div>
            <p className="font-black text-sm uppercase tracking-widest mb-1">
              {toast.type === 'success' ? 'Product Updated!' : 'Error'}
            </p>
            <p className="font-medium text-sm opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-auto text-white/70 hover:text-white text-xl font-black leading-none mt-0.5">✕</button>
        </div>
      )}

      <div className="mb-8 border-b border-slate-100 pb-6 flex items-center justify-between">
        <div>
            <h3 className="text-2xl font-black text-slate-800">Edit Product</h3>
            <p className="text-slate-500 font-medium mt-2">Modify the details of your premium surface piece.</p>
        </div>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-bold px-4 py-2 border rounded-xl">Back to Overview</button>
      </div>

      <form className="space-y-8 max-w-5xl" onSubmit={handleUpdate}>
        


        {/* ── OPTIONS VIEW COLLECTION (COLOR VARIATIONS) ── */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Options View Collection</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Edit or add color-specific galleries</p>
            </div>
            <button 
              type="button"
              onClick={handleAddColorOption}
              className="bg-blue-600 hover:bg-black text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
            >
              + Add New Color
            </button>
          </div>

          <div className="space-y-10">
            {colorOptions.map((opt, optIdx) => (
              <div key={optIdx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
                {/* Remove this entire color option */}
                <button
                  type="button"
                  onClick={() => handleRemoveColorOption(optIdx)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-10 text-lg font-black"
                >×</button>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Color Details Header */}
                  <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Variation Name</label>
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => handleColorFieldChange(optIdx, 'name', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                        placeholder="e.g. Arctic Blue Slabs"
                      />
                    </div>

                    {/* Thumbnail / Swatch Image Slot */}
                    <div className="flex flex-col items-center">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Swatch Icon</label>
                      <div className="w-14 h-14 bg-white border-2 border-dashed border-blue-200 rounded-xl relative overflow-hidden flex items-center justify-center group/swatch hover:border-blue-500 transition-all shadow-sm">
                        {opt.thumbnailPreview || opt.existingThumbnail ? (
                          <>
                            <img 
                              src={opt.thumbnailPreview || getImageUrl(opt.existingThumbnail)} 
                              alt="swatch" 
                              className="w-full h-full object-cover" 
                            />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveColorThumbnail(optIdx)}
                              className="absolute inset-0 bg-red-500/80 opacity-0 group-hover/swatch:opacity-100 transition-all flex items-center justify-center text-white font-black text-sm"
                            >✕</button>
                          </>
                        ) : (
                          <>
                            <span className="text-blue-400 text-lg font-light">+</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={(e) => handleColorThumbnailChange(e, optIdx)} 
                            />
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Collection Name
                      </label>
                      <input
                        type="text"
                        value={opt.productName || ""}
                        onChange={(e) => handleColorFieldChange(optIdx, 'productName', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                        placeholder="Enter name to show as main title"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Variation Price (Sqft)</label>
                      <input
                        type="number"
                        value={opt.pricePerSqft || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const sqft = opt.sqftPerBox;
                          handleColorFieldChange(optIdx, 'pricePerSqft', val);
                          if(val && sqft) handleColorFieldChange(optIdx, 'price', (parseFloat(val) * parseFloat(sqft)).toFixed(2));
                          else handleColorFieldChange(optIdx, 'price', "");
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                        placeholder="e.g. 599"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Sq.Ft per {opt.pricingUnit || "Box"}</label>
                      <input
                        type="number"
                        value={opt.sqftPerBox || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const priceSqft = opt.pricePerSqft;
                          handleColorFieldChange(optIdx, 'sqftPerBox', val);
                          if(val && priceSqft) handleColorFieldChange(optIdx, 'price', (parseFloat(val) * parseFloat(priceSqft)).toFixed(2));
                          else handleColorFieldChange(optIdx, 'price', "");
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                        placeholder="e.g. 15.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Variation Pricing Unit</label>
                      <select 
                        value={opt.pricingUnit || "Box"} 
                        onChange={(e) => handleColorFieldChange(optIdx, 'pricingUnit', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 cursor-pointer"
                      >
                        <option value="Box">Box</option>
                        <option value="Sheet">Sheet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                        SKU Code
                      </label>
                      <input
                        type="text"
                        value={opt.sku || ""}
                        onChange={(e) => handleColorFieldChange(optIdx, 'sku', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                        placeholder="Variation SKU"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Colors, Shapes, Mosaici & Attributes</label>
                      <button
                        type="button"
                        onClick={() => setShowColorsShapes(prev => ({ ...prev, [optIdx]: !prev[optIdx] }))}
                        className={`w-full px-4 py-2 text-xs font-bold border rounded-xl transition-all text-center flex items-center justify-center gap-2 ${
                          showColorsShapes[optIdx] ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
                        }`}
                      >
                        <span>{showColorsShapes[optIdx] ? "✕ Close Selection" : "🎨 Choose Colors, Shapes, Mosaici & Attributes"}</span>
                      </button>
                    </div>

                    {showColorsShapes[optIdx] && (
                      <div className="col-span-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-2 mt-2 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div>
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Assign Colors</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {Array.from(new Set([...availableColours, ...(variationColors || []).map(c => c.name)])).map((color) => {
                                const isSelected = Array.isArray(opt.colors) && opt.colors.includes(color);
                                const isDefaultColor = [].includes(color);
                                return (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => {
                                      const current = Array.isArray(opt.colors) ? opt.colors : [];
                                      const updated = isSelected 
                                        ? current.filter(c => c !== color) 
                                        : [...current, color];
                                      handleColorFieldChange(optIdx, "colors", updated);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border uppercase tracking-wider flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span>{color}</span>
                                    {!isDefaultColor && (
                                      <span 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteColorAttribute(color);
                                        }}
                                        className="ml-1 text-red-500 hover:text-red-700 font-extrabold cursor-pointer text-[9px] lowercase bg-slate-100/85 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center border-none"
                                      >
                                        ✕
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 mt-3 items-center">
                              <input 
                                type="text" 
                                placeholder="New color..." 
                                value={newColorInput} 
                                onChange={(e) => setNewColorInput(e.target.value)} 
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddColorAttribute();
                                  }
                                }}
                                className="px-3 py-1 bg-white border border-slate-300 rounded-full outline-none focus:border-blue-500 font-semibold text-slate-800 text-[10px] w-28"
                              />
                              <button 
                                type="button" 
                                onClick={handleAddColorAttribute}
                                className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-full hover:bg-black transition-colors"
                              >
                                Add Color
                              </button>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Assign Shapes</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {availableShapes.map((shape) => {
                                const isSelected = Array.isArray(opt.shapes) && opt.shapes.includes(shape);
                                const isDefaultShape = [].includes(shape);
                                return (
                                  <button
                                    key={shape}
                                    type="button"
                                    onClick={() => {
                                      const current = Array.isArray(opt.shapes) ? opt.shapes : [];
                                      const updated = isSelected 
                                        ? current.filter(s => s !== shape) 
                                        : [...current, shape];
                                      handleColorFieldChange(optIdx, "shapes", updated);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border uppercase tracking-wider flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span>{shape}</span>
                                    {!isDefaultShape && (
                                      <span 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteShapeAttribute(shape);
                                        }}
                                        className="ml-1 text-red-500 hover:text-red-700 font-extrabold cursor-pointer text-[9px] lowercase bg-slate-100/85 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center border-none"
                                      >
                                        ✕
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 mt-3 items-center">
                              <input 
                                type="text" 
                                placeholder="New shape..." 
                                value={newShapeInput} 
                                onChange={(e) => setNewShapeInput(e.target.value)} 
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddShapeAttribute();
                                  }
                                }}
                                className="px-3 py-1 bg-white border border-slate-300 rounded-full outline-none focus:border-blue-500 font-semibold text-slate-800 text-[10px] w-28"
                              />
                              <button 
                                type="button" 
                                onClick={handleAddShapeAttribute}
                                className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-full hover:bg-black transition-colors"
                              >
                                Add Shape
                              </button>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Assign Mosaici</h5>
                            <div className="flex flex-wrap gap-1.5 font-sans">
                              {availableMosaici.map((mos) => {
                                const isSelected = Array.isArray(opt.mosaici) && opt.mosaici.includes(mos);
                                const isDefaultMosaici = [].includes(mos);
                                return (
                                  <button
                                    key={mos}
                                    type="button"
                                    onClick={() => {
                                      const current = Array.isArray(opt.mosaici) ? opt.mosaici : [];
                                      const updated = isSelected 
                                        ? current.filter(m => m !== mos) 
                                        : [...current, mos];
                                      handleColorFieldChange(optIdx, "mosaici", updated);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border uppercase tracking-wider flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span>{mos}</span>
                                    {!isDefaultMosaici && (
                                      <span 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteMosaiciAttribute(mos);
                                        }}
                                        className="ml-1 text-red-500 hover:text-red-700 font-extrabold cursor-pointer text-[9px] lowercase bg-slate-100/85 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center border-none"
                                      >
                                        ✕
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 mt-3 items-center">
                              <input 
                                type="text" 
                                placeholder="New Mosaici..." 
                                value={newMosaiciInput} 
                                onChange={(e) => setNewMosaiciInput(e.target.value)} 
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddMosaiciAttribute();
                                  }
                                }}
                                className="px-3 py-1 bg-white border border-slate-300 rounded-full outline-none focus:border-blue-500 font-semibold text-slate-800 text-[10px] w-28"
                              />
                              <button 
                                type="button" 
                                onClick={handleAddMosaiciAttribute}
                                className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-full hover:bg-black transition-colors"
                              >
                                Add Mosaici
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-200">
                          <div>
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Assign Effects</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {availableEffects.map((eff) => {
                                const isSelected = Array.isArray(opt.effects) && opt.effects.includes(eff);
                                const isDefaultEffect = [].includes(eff);
                                return (
                                  <button
                                    key={eff}
                                    type="button"
                                    onClick={() => {
                                      const current = Array.isArray(opt.effects) ? opt.effects : [];
                                      const updated = isSelected 
                                        ? current.filter(e => e !== eff) 
                                        : [...current, eff];
                                      handleColorFieldChange(optIdx, "effects", updated);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border uppercase tracking-wider flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span>{eff}</span>
                                    {!isDefaultEffect && (
                                      <span 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteEffectAttribute(eff);
                                        }}
                                        className="ml-1 text-red-500 hover:text-red-700 font-extrabold cursor-pointer text-[9px] lowercase bg-slate-100/85 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center border-none"
                                      >
                                        ✕
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 mt-3 items-center">
                              <input 
                                type="text" 
                                placeholder="New effect..." 
                                value={newEffectInput} 
                                onChange={(e) => setNewEffectInput(e.target.value)} 
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddEffectAttribute();
                                  }
                                }}
                                className="px-3 py-1 bg-white border border-slate-300 rounded-full outline-none focus:border-blue-500 font-semibold text-slate-800 text-[10px] w-28"
                              />
                              <button 
                                type="button" 
                                onClick={handleAddEffectAttribute}
                                className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-full hover:bg-black transition-colors"
                              >
                                Add Effect
                              </button>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Assign Formats</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {availableFormats.map((form) => {
                                const isSelected = Array.isArray(opt.formats) && opt.formats.includes(form);
                                const isDefaultFormat = [].includes(form);
                                return (
                                  <button
                                    key={form}
                                    type="button"
                                    onClick={() => {
                                      const current = Array.isArray(opt.formats) ? opt.formats : [];
                                      const updated = isSelected 
                                        ? current.filter(f => f !== form) 
                                        : [...current, form];
                                      handleColorFieldChange(optIdx, "formats", updated);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border uppercase tracking-wider flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span>{form}</span>
                                    {!isDefaultFormat && (
                                      <span 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteFormatAttribute(form);
                                        }}
                                        className="ml-1 text-red-500 hover:text-red-700 font-extrabold cursor-pointer text-[9px] lowercase bg-slate-100/85 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center border-none"
                                      >
                                        ✕
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 mt-3 items-center">
                              <input 
                                type="text" 
                                placeholder="New format..." 
                                value={newFormatInput} 
                                onChange={(e) => setNewFormatInput(e.target.value)} 
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddFormatAttribute();
                                  }
                                }}
                                className="px-3 py-1 bg-white border border-slate-300 rounded-full outline-none focus:border-blue-500 font-semibold text-slate-800 text-[10px] w-28"
                              />
                              <button 
                                type="button" 
                                onClick={handleAddFormatAttribute}
                                className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-full hover:bg-black transition-colors"
                              >
                                Add Format
                              </button>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Assign Finishes</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {availableFinishes.map((fin) => {
                                const isSelected = Array.isArray(opt.finishes) && opt.finishes.includes(fin);
                                const isDefaultFinish = [].includes(fin);
                                return (
                                  <button
                                    key={fin}
                                    type="button"
                                    onClick={() => {
                                      const current = Array.isArray(opt.finishes) ? opt.finishes : [];
                                      const updated = isSelected 
                                        ? current.filter(f => f !== fin) 
                                        : [...current, fin];
                                      handleColorFieldChange(optIdx, "finishes", updated);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border uppercase tracking-wider flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span>{fin}</span>
                                    {!isDefaultFinish && (
                                      <span 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteFinishAttribute(fin);
                                        }}
                                        className="ml-1 text-red-500 hover:text-red-700 font-extrabold cursor-pointer text-[9px] lowercase bg-slate-100/85 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center border-none"
                                      >
                                        ✕
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 mt-3 items-center">
                              <input 
                                type="text" 
                                placeholder="New finish..." 
                                value={newFinishInput} 
                                onChange={(e) => setNewFinishInput(e.target.value)} 
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddFinishAttribute();
                                  }
                                }}
                                className="px-3 py-1 bg-white border border-slate-300 rounded-full outline-none focus:border-blue-500 font-semibold text-slate-800 text-[10px] w-28"
                              />
                              <button 
                                type="button" 
                                onClick={handleAddFinishAttribute}
                                className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-full hover:bg-black transition-colors"
                              >
                                Add Finish
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Variation Sizes</label>
                      <div className="flex flex-col gap-2">
                        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                          <input
                            type="text"
                            id={`edit-size-input-${optIdx}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = e.target.value.trim();
                                if (val) {
                                  let currentSizes = Array.isArray(opt.sizes) ? opt.sizes : [];
                                  if (!currentSizes.includes(val)) {
                                    handleColorFieldChange(optIdx, 'sizes', [...currentSizes, val]);
                                  }
                                  e.target.value = '';
                                }
                              }
                            }}
                            className="w-full px-4 py-3 focus:outline-none font-bold text-slate-800 text-sm"
                            placeholder="e.g. 12x24 (Press Enter)"
                          />
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const input = document.getElementById(`edit-size-input-${optIdx}`);
                              if(input && input.value.trim()) {
                                  const val = input.value.trim();
                                  let currentSizes = Array.isArray(opt.sizes) ? opt.sizes : [];
                                  if (!currentSizes.includes(val)) {
                                    handleColorFieldChange(optIdx, 'sizes', [...currentSizes, val]);
                                  }
                                  input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] uppercase transition-colors border-l border-slate-200"
                          >
                            Add
                          </button>
                        </div>
                        {Array.isArray(opt.sizes) && opt.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {opt.sizes.map((sz, i) => (
                              <span key={`${sz}-${i}`} className="inline-flex items-center gap-1.5 bg-slate-800 text-white shadow-sm text-[11px] font-bold px-3 py-1 rounded-full">
                                {sz}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSizes = opt.sizes.filter(s => s !== sz);
                                    handleColorFieldChange(optIdx, 'sizes', newSizes);
                                  }}
                                  className="text-slate-300 hover:text-red-400 transition-colors ml-1"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Variation Description</label>
                        <textarea
                          value={opt.description}
                          onChange={(e) => handleColorFieldChange(optIdx, 'description', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 min-h-[100px]"
                          placeholder="Enter specific description for this variation..."
                        />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Variation Video (Optional)</label>
                      <div className={`aspect-video bg-white border-2 border-dashed ${opt.video || opt.existingVideo ? 'border-green-400 bg-green-50' : 'border-slate-200'} rounded-xl flex flex-col items-center justify-center relative overflow-hidden group/vid hover:border-blue-400 transition-all`}>
                        {opt.video || opt.existingVideo ? (
                          <div className="flex flex-col items-center px-4 text-center">
                            <svg className="w-8 h-8 text-green-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
                            <span className="text-[10px] font-bold text-green-700 truncate w-full px-2">{opt.video ? opt.video.name : 'Existing Video Attached'}</span>
                            <button 
                              type="button" 
                              onClick={() => removeColorVideo(optIdx)}
                              className="mt-2 text-[10px] bg-red-500 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-tighter hover:bg-red-600 transition-colors shadow-sm relative z-10"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg className="w-8 h-8 text-slate-300 group-hover/vid:text-blue-400 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest text-center">Click to upload Video</p>
                          </>
                        )}
                        <input
                          type="file"
                          accept="video/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleColorVideoChange(e, optIdx)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images Area */}
                  <div className="lg:col-span-4 space-y-4">
                    
                    {/* Existing Images */}
                    {opt.existingImages.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Current Images — click ✕ to remove</p>
                        <div className="flex flex-wrap gap-3">
                          {opt.existingImages.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                              <img 
                                src={getImageUrl(imgUrl)} 
                                alt="colour-img" 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingColorImage(optIdx, imgIdx)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-xl font-black"
                              >✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Image Upload Slots */}
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Add More Images</p>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {[0,1,2,3,4,5,6,7].map(slotIdx => (
                          <div key={slotIdx} className="aspect-square bg-white border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden group/img hover:border-blue-400 transition-all">
                            {opt.previews[slotIdx] ? (
                              <>
                                <img src={opt.previews[slotIdx]} alt="new" className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveNewColorImage(optIdx, slotIdx)}
                                  className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center text-white font-black"
                                >✕</button>
                              </>
                            ) : (
                              <>
                                <span className="text-lg text-slate-300 font-light">+</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="absolute inset-0 opacity-0 cursor-pointer" 
                                  onChange={(e) => handleNewColorImageChange(e, optIdx, slotIdx)}
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {colorOptions.length === 0 && (
              <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">No color variations. Click "+ Add New Color" to add one.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLORS & PRICING UNIT (BROUGHT TO TOP FOR VISIBILITY) */}
        <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-black text-slate-800 mb-4 uppercase tracking-widest italic">Product Colors & Pricing Unit</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-2">Available Colors (Add icons here) 🎨</label>
              <div className="flex bg-white border border-slate-300 rounded-xl px-4 py-2 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                  <div className="flex flex-wrap gap-2 items-center flex-1">
                    {variationColors.map((colorObj, idx) => (
                        <div key={colorObj.name} className="bg-slate-50 border border-slate-200 p-1 rounded-full flex items-center gap-2 pr-3 transition-all hover:border-blue-400">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 overflow-hidden relative group/icon">
                                {colorObj.preview ? (
                                    <img src={colorObj.preview} alt={colorObj.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase pointer-events-none">Img</div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const newColors = [...variationColors];
                                            newColors[idx] = { ...newColors[idx], file, preview: URL.createObjectURL(file) };
                                            setVariationColors(newColors);
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none"></div>
                            </div> 
                            <span className="text-slate-700 text-[10px] font-black uppercase tracking-wider">{colorObj.name}</span>
                            <button type="button" onClick={() => setVariationColors(variationColors.filter(c => c.name !== colorObj.name))} className="text-slate-400 hover:text-red-500 transition-colors">✕</button>
                        </div>
                    ))}
                    <input 
                      type="text" 
                      value={colorInput} 
                      onChange={e => setColorInput(e.target.value)}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = colorInput.trim();
                              if (val && !variationColors.find(c => c.name.toLowerCase() === val.toLowerCase())) {
                                  setVariationColors([...variationColors, { name: val, file: null, preview: null, image: "" }]);
                                  setColorInput("");
                              }
                          }
                      }}
                      className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-800 text-lg min-w-[120px] py-2" 
                      placeholder={variationColors.length > 0 ? "Add more..." : "Type color & press Enter"} 
                    />
                  </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Main Pricing Unit</label>
              <select 
                value={pricingUnit} 
                onChange={e => setPricingUnit(e.target.value)} 
                className="w-full bg-white border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800 text-lg shadow-sm cursor-pointer"
              >
                <option value="Box">Box</option>
                <option value="Sheet">Sheet</option>
              </select>
            </div>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Main SKU / Tile Code</label>
            <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800 text-lg shadow-sm" placeholder="e.g. GL-701" />
          </div>


          <div className="md:col-span-3">
            <label className="block text-sm font-bold text-slate-700 mb-2">Series / Collection <span className="text-blue-500 text-[10px] uppercase font-black ml-2 tracking-widest">(Optional)</span></label>
            <select 
              value={series} 
              onChange={e => setSeries(e.target.value)} 
              className={`w-full border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800 text-lg shadow-sm cursor-pointer ${series ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-300'}`}
            >
              <option value="">Select a Collection</option>
              {COLLECTIONS.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>



        {/* FILTERS */}
        <div className="space-y-0">
          <MultiSelectGroup 
            title="Tile Uses" 
            attrKey="tileUses"
            options={TILEUSES} 
            selected={tileUses} 
            toggleSelection={(val) => handleToggle(val, tileUses, setTileUses)}
            allowCustom={true}
            customVal={customTileUse}
            setCustomVal={setCustomTileUse}
            onAddCustom={() => handleAddCustomAttribute("tileUses", customTileUse, setCustomTileUse)}
            onDeleteCustom={(val) => handleDeleteCustomAttribute("tileUses", val)}
          />
          <MultiSelectGroup 
            title="Styles" 
            attrKey="styles"
            options={STYLES} 
            selected={styles} 
            toggleSelection={(val) => handleToggle(val, styles, setStyles)}
            allowCustom={true}
            customVal={customStyle}
            setCustomVal={setCustomStyle}
            onAddCustom={() => handleAddCustomAttribute("styles", customStyle, setCustomStyle)}
            onDeleteCustom={(val) => handleDeleteCustomAttribute("styles", val)}
          />
          <MultiSelectGroup 
            title="Materials" 
            attrKey="materials"
            options={MATERIALS} 
            selected={materials} 
            toggleSelection={(val) => handleToggle(val, materials, setMaterials)}
            allowCustom={true}
            customVal={customMaterial}
            setCustomVal={setCustomMaterial}
            onAddCustom={() => handleAddCustomAttribute("materials", customMaterial, setCustomMaterial)}
            onDeleteCustom={(val) => handleDeleteCustomAttribute("materials", val)}
          />
          <MultiSelectGroup 
            title="Looks" 
            attrKey="looks"
            options={LOOKS} 
            selected={looks} 
            toggleSelection={(val) => handleToggle(val, looks, setLooks)}
            allowCustom={true}
            customVal={customLook}
            setCustomVal={setCustomLook}
            onAddCustom={() => handleAddCustomAttribute("looks", customLook, setCustomLook)}
            onDeleteCustom={(val) => handleDeleteCustomAttribute("looks", val)}
          />
        </div>

        {/* SUBMIT */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-center sticky bottom-0 bg-white/95 backdrop-blur-md pb-4 z-10 -mx-10 px-10 rounded-b-3xl">
          <button type="button" onClick={onCancel} className="px-6 py-3 text-slate-500 hover:text-red-500 font-bold transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className={`px-10 py-4 ${isSubmitting ? 'bg-slate-600' : 'bg-slate-900 hover:bg-black'} text-white rounded-xl font-black tracking-wider shadow-xl shadow-slate-900/30 transition-all hover:-translate-y-1 uppercase text-sm`}>
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
