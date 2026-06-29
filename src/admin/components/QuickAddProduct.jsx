import React, { useState } from "react";
import ColorOptionsManager from "./ColorOptionsManager";
import TileLoader from "../../components/TileLoader";

const DEFAULT_ATTRIBUTES = {
  effects: [],
  formats: [],
  tileUses: ["Bathroom Wall", "Outdoor Wall", "Kitchen Wall", "Wall Tile", "Backsplash", "Shower Wall", "Kitchen Floor", "Floor Tile", "Bathroom Floor", "Commercial Floor", "Outdoor Floor", "Shower Floor", "Pool Tile"],
  styles: ["Traditional", "Contemporary", "Rustic", "Modern", "Transitional", "Industrial", "Classic", "Mediterranean", "Mid Century", "Farmhouse", "Craftsman", "Beach", "Cottage", "Tropical", "Art Deco", "Whimsical", "Spanish Revival"],
  materials: ["Ceramic & Porcelain", "Porcelain", "Stone", "Marble", "Glass", "Ceramic", "Terrazzo", "Pebble Tile", "Terracotta", "Lava Stone", "Clay Brick", "Cement"],
  looks: ["Stone Look", "Decorative Look", "Marble Look", "Concrete Look", "Solid Color", "Wood Look", "3D", "Subway Tile"],
  finishes: []
};

const QuickAddProduct = ({ series, onCancel, onSuccess }) => {
  const [name, setName] = useState("");
  const [pricePerSqft, setPricePerSqft] = useState("");
  const [sqftPerBox, setSqftPerBox] = useState("");
  const [price, setPrice] = useState("");
  const [pricingUnit, setPricingUnit] = useState("Box");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState(Array(5).fill(null));
  const [video, setVideo] = useState(null);
  const [images360, setImages360] = useState([]);
  const [currentSizeInput, setCurrentSizeInput] = useState("");
  const [currentColorInput, setCurrentColorInput] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [variationColors, setVariationColors] = useState([]); // Array of { name, file, preview }
  const [colorInput, setColorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);




  // Product Attribute Tags
  const [effects, setEffects] = useState([]);
  const [formats, setFormats] = useState([]);
  const [tileUses, setTileUses] = useState([]);
  const [styles, setStyles] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [looks, setLooks] = useState([]);
  const [finishes, setFinishes] = useState([]);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const [dbAttributes, setDbAttributes] = useState({
    colors:    [],
    effects:   [],
    formats:   [],
    tileUses:  ["Bathroom Wall","Outdoor Wall","Kitchen Wall","Wall Tile","Backsplash","Shower Wall","Kitchen Floor","Floor Tile","Bathroom Floor","Commercial Floor","Outdoor Floor","Shower Floor","Pool Tile"],
    styles:    ["Traditional","Contemporary","Rustic","Modern","Transitional","Industrial","Classic","Mediterranean","Mid Century","Farmhouse","Craftsman","Beach","Cottage","Tropical","Art Deco","Whimsical","Spanish Revival"],
    materials: ["Ceramic & Porcelain","Porcelain","Stone","Marble","Glass","Ceramic","Terrazzo","Pebble Tile","Terracotta","Lava Stone","Clay Brick","Cement"],
    looks:     ["Stone Look","Decorative Look","Marble Look","Concrete Look","Solid Color","Wood Look","3D","Subway Tile"],
    finishes:  []
  });

  const [customInputs, setCustomInputs] = useState({});

  React.useEffect(() => {
    const fetchDbAttributes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes`);
        if (res.ok) {
          const data = await res.json();
          setDbAttributes(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Error fetching attributes:", err);
      }
    };
    fetchDbAttributes();
  }, []);

  const ATTR_OPTIONS = {
    effects: Array.from(new Set([...DEFAULT_ATTRIBUTES.effects, ...(dbAttributes.effects || [])])),
    formats: Array.from(new Set([...DEFAULT_ATTRIBUTES.formats, ...(dbAttributes.formats || [])])),
    tileUses: Array.from(new Set([...DEFAULT_ATTRIBUTES.tileUses, ...(dbAttributes.tileUses || [])])),
    styles: Array.from(new Set([...DEFAULT_ATTRIBUTES.styles, ...(dbAttributes.styles || [])])),
    materials: Array.from(new Set([...DEFAULT_ATTRIBUTES.materials, ...(dbAttributes.materials || [])])),
    looks: Array.from(new Set([...DEFAULT_ATTRIBUTES.looks, ...(dbAttributes.looks || [])])),
    finishes: Array.from(new Set([...DEFAULT_ATTRIBUTES.finishes, ...(dbAttributes.finishes || [])])),
  };

  const handleAddCustomAttribute = async (key) => {
    const val = (customInputs[key] || "").trim();
    if (!val) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/${key}/add`, {
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
          [key]: data.values
        }));
        setCustomInputs(prev => ({
          ...prev,
          [key]: ""
        }));

        // Automatically select the newly added custom value
        const formattedVal = val.charAt(0).toUpperCase() + val.slice(1);
        if (key === "effects") {
          setEffects(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (key === "formats") {
          setFormats(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (key === "tileUses") {
          setTileUses(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (key === "styles") {
          setStyles(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (key === "materials") {
          setMaterials(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (key === "looks") {
          setLooks(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        } else if (key === "finishes") {
          setFinishes(prev => prev.includes(formattedVal) ? prev : [...prev, formattedVal]);
        }
      } else {
        alert("Failed to add custom attribute value.");
      }
    } catch (err) {
      console.error("Error adding custom attribute:", err);
    }
  };

  const handleDeleteCustomAttribute = async (key, val) => {
    if (!window.confirm(`Delete "${val}" from ${key}?`)) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes/${key}/delete`, {
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
          [key]: data.values
        }));
        
        // Also remove from selected array if it was selected
        if (key === "effects") {
          setEffects(prev => prev.filter(v => v !== val));
        } else if (key === "formats") {
          setFormats(prev => prev.filter(v => v !== val));
        } else if (key === "tileUses") {
          setTileUses(prev => prev.filter(v => v !== val));
        } else if (key === "styles") {
          setStyles(prev => prev.filter(v => v !== val));
        } else if (key === "materials") {
          setMaterials(prev => prev.filter(v => v !== val));
        } else if (key === "looks") {
          setLooks(prev => prev.filter(v => v !== val));
        } else if (key === "finishes") {
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

  // Sync variations when main pricing unit changes
  React.useEffect(() => {
    setColorOptions(prev => prev.map(opt => ({
      ...opt,
      pricingUnit: pricingUnit // Force sync all variations to main unit
    })));
  }, [pricingUnit]);

  const handlePriceSqftChange = (val) => {
    setPricePerSqft(val);
    if (val && sqftPerBox) setPrice((parseFloat(val) * parseFloat(sqftPerBox)).toFixed(2));
    else setPrice("");
  };

  const handleSqftBoxChange = (val) => {
    setSqftPerBox(val);
    if (val && pricePerSqft) setPrice((parseFloat(val) * parseFloat(pricePerSqft)).toFixed(2));
    else setPrice("");
  };

  const handleColorThumbnailChange = (e, optIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    const newOptions = [...colorOptions];
    newOptions[optIdx] = { ...newOptions[optIdx], thumbnail: file, thumbnailPreview: URL.createObjectURL(file) };
    setColorOptions(newOptions);
  };

  const removeColorThumbnail = (optIdx) => {
    const newOptions = [...colorOptions];
    newOptions[optIdx] = { ...newOptions[optIdx], thumbnail: null, thumbnailPreview: null };
    setColorOptions(newOptions);
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalName = colorOptions.length > 0 ? (colorOptions[0].productName || colorOptions[0].name) : series;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", finalName || "Unnamed Product");
    formData.append("series", series);
    formData.append("pricingUnit", pricingUnit);
    formData.append("variationColors", JSON.stringify(variationColors.map(c => c.name)));
    const colorIndices = [];
    let uploadIdx = 0;
    variationColors.forEach(c => {
      if (c.file) {
        formData.append("variationColorImages", c.file);
        colorIndices.push(uploadIdx++);
      } else {
        colorIndices.push(null);
      }
    });
    formData.append("variationColorIndices", JSON.stringify(colorIndices));




    formData.append("pricePerSqft", 0);
    formData.append("sqftPerBox", 0);
    formData.append("price", 0);
    formData.append("description", description);
    formData.append("sizes", JSON.stringify([]));
    formData.append("effects",   JSON.stringify([]));
    formData.append("formats",   JSON.stringify([]));
    formData.append("colors",    JSON.stringify([]));
    formData.append("tileUses",  JSON.stringify(tileUses));
    formData.append("styles",    JSON.stringify(styles));
    formData.append("materials", JSON.stringify(materials));
    formData.append("looks",     JSON.stringify(looks));
    formData.append("finishes",  JSON.stringify([]));

    images.forEach(f => { if (f) formData.append("images", f); });
    if (video) formData.append("video", video);
    if (images360 && images360.length > 0) {
      images360.forEach(f => formData.append("images360", f));
    }

    const colorPayload = colorOptions.map(opt => {
      const imgIndices = [];
      opt.images.forEach(f => {
        if (f) {
          imgIndices.push(formData.getAll("colorImages").length);
          formData.append("colorImages", f);
        }
      });
      let vidIdx = undefined;
      if (opt.video) {
        vidIdx = formData.getAll("colorVideos").length;
        formData.append("colorVideos", opt.video);
      }
      let thumbIdx = undefined;
      if (opt.thumbnail) {
        thumbIdx = formData.getAll("colorThumbnails").length;
        formData.append("colorThumbnails", opt.thumbnail);
      }

      const images360Indices = [];
      if (opt.images360 && opt.images360.length > 0) {
        opt.images360.forEach(f => {
          if (f) {
            images360Indices.push(formData.getAll("colorImages360").length);
            formData.append("colorImages360", f);
          }
        });
      }

      return { 
        colors: opt.colors || (opt.color ? [opt.color] : []), 
        shapes: opt.shapes || [],
        shape: opt.shape || "",
        effects: opt.effects || [],
        finishes: opt.finishes || [],
        formats: opt.formats || [],
        color: opt.color, 
        name: opt.name, 
        sku: opt.sku || "",
        productName: opt.productName || "", 
        price: Number(opt.price), 
        pricePerSqft: Number(opt.pricePerSqft), 
        sqftPerBox: Number(opt.sqftPerBox), 
        sizes: opt.sizes, 
        description: opt.description, 
        imageIndices: imgIndices, 
        videoIndex: vidIdx,
        thumbnailIndex: thumbIdx,
        pricingUnit: opt.pricingUnit || pricingUnit,
        images360Indices
      };
    });
    console.log("QuickAddProduct colorPayload:", colorPayload);
    formData.append("colorOptions", JSON.stringify(colorPayload));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, { method: "POST", body: formData });
      if (response.ok) {
        onSuccess();
        alert("Product published to " + series + " successfully.");
      } else {
        const err = await response.json();
        alert("Upload Error: " + err.message);
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-600 bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }} className="bg-white border border-gray-200 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Add New Product</h3>
          <p className="text-xs text-gray-500 mt-0.5">Series: <span className="font-semibold text-gray-700">{series}</span></p>
        </div>
        <button type="button" onClick={onCancel} className="text-xs text-gray-500 hover:text-red-600 border border-gray-300 px-3 py-1.5 hover:border-red-400 transition-colors">
          Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }}
        className="divide-y divide-gray-100"
      >



        <div className="px-6 py-5">
          <label className={labelClass}>Pricing Unit & Available Colors (w/ Icons)</label>
          <div className="flex gap-4 items-start">
            <select 
              value={pricingUnit} 
              onChange={e => setPricingUnit(e.target.value)} 
              className="w-1/3 border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-600 bg-white"
            >
              <option value="Box">Box</option>
              <option value="Sheet">Sheet</option>
            </select>
            
            <div className="flex-1 min-w-0">
               <div className="flex flex-wrap gap-2 items-center border border-gray-300 px-3 py-1.5 focus-within:border-gray-600 bg-white min-h-[38px]">
                  {variationColors.map((colorObj, idx) => (
                     <div key={colorObj.name} className="bg-gray-50 border border-gray-200 p-0.5 rounded-full flex items-center gap-2 pr-2">
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 overflow-hidden relative group/icon">
                            {colorObj.preview ? (
                                <img src={colorObj.preview} alt={colorObj.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 font-bold uppercase">Img</div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const newColors = [...variationColors];
                                        newColors[idx] = { ...newColors[idx], file, preview: URL.createObjectURL(file) };
                                        setVariationColors(newColors);
                                    }
                                }}
                            />
                        </div>
                        <span className="text-gray-700 text-[10px] font-bold uppercase tracking-wider">{colorObj.name}</span>
                        <button type="button" onClick={() => setVariationColors(variationColors.filter(c => c.name !== colorObj.name))} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
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
                                setVariationColors([...variationColors, { name: val, file: null, preview: null }]);
                                setColorInput("");
                            }
                        }
                    }}
                    className="flex-1 border-none focus:ring-0 text-sm py-1 min-w-[100px]" 
                    placeholder={variationColors.length > 0 ? "Add..." : "Type color & press Enter"} 
                  />
               </div>
            </div>
          </div>
        </div>











        {/* SECTION 6: Product Attributes */}
        <div className="px-6 py-5">
          <label className={labelClass}>Product Attributes</label>
          <p className="text-[11px] text-gray-400 mb-4">Click chips to select — selected tags will appear on the product page</p>
          <div className="space-y-4">
            {[
              { label: "Tile Use", key: "tileUses",  state: tileUses,  set: setTileUses },
              { label: "Style",    key: "styles",    state: styles,    set: setStyles },
              { label: "Material", key: "materials", state: materials, set: setMaterials },
              { label: "Look",     key: "looks",     state: looks,     set: setLooks },
            ].map(({ label, key, state, set }) => (
              <div key={key} className="flex items-start gap-4">
                <span className="w-16 shrink-0 text-[10px] font-semibold text-gray-500 uppercase tracking-wider pt-1.5">{label}</span>
                <div className="flex flex-wrap gap-1.5 items-center flex-1">
                  {ATTR_OPTIONS[key].map(opt => {
                    const selected = state.includes(opt);
                    const isDefault = DEFAULT_ATTRIBUTES[key]?.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(state, set, opt)}
                        className={`px-3 py-1 text-[11px] border transition-colors flex items-center gap-1 ${
                          selected
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-500 border-gray-300 hover:border-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <span>{opt}</span>
                        {!isDefault && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomAttribute(key, opt);
                            }}
                            className={`ml-1 font-extrabold cursor-pointer text-[9px] lowercase rounded-full w-3.5 h-3.5 inline-flex items-center justify-center border-none transition-colors ${
                              selected
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
                  
                  {/* Inline custom addition */}
                  <div className="flex items-center gap-1.5 ml-2 mt-1 sm:mt-0">
                    <input
                      type="text"
                      placeholder="Custom..."
                      value={customInputs[key] || ""}
                      onChange={(e) => setCustomInputs({ ...customInputs, [key]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomAttribute(key);
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] border border-gray-300 rounded-none outline-none focus:border-gray-900 w-24"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomAttribute(key)}
                      className="px-3 py-1 bg-gray-900 hover:bg-black text-white text-[11px] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: Color Variations */}
        <div className="px-6 py-5">
          <label className={labelClass}>Variations</label>
          <ColorOptionsManager 
            colorOptions={colorOptions} 
            setColorOptions={setColorOptions} 
            handleColorThumbnailChange={handleColorThumbnailChange}
            removeColorThumbnail={removeColorThumbnail}
            parentPricingUnit={pricingUnit}
            availableColors={variationColors.map(c => c.name)}
          />


        </div>

        {/* SUBMIT */}
        <div className="px-6 py-5 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">All fields marked * are required.</p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black'} text-white px-8 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors`}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>

      {isSubmitting && <TileLoader />}
    </div>
  );
};

export default QuickAddProduct;
