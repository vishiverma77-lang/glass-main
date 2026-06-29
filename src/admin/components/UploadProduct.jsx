import React, { useState } from "react";
import TileLoader from "../../components/TileLoader";
import { COLLECTIONS } from "../constants";
import ColorOptionsManager from "./ColorOptionsManager";

const DEFAULT_ATTRIBUTES = {
  effects: [],
  formats: [],
  tileUses: ["Bathroom Wall", "Outdoor Wall", "Kitchen Wall", "Wall Tile", "Backsplash", "Shower Wall", "Kitchen Floor", "Floor Tile", "Bathroom Floor", "Commercial Floor", "Outdoor Floor", "Shower Floor", "Pool Tile"],
  styles: ["Traditional", "Contemporary", "Rustic", "Modern", "Transitional", "Industrial", "Classic", "Mediterranean", "Mid Century", "Farmhouse", "Craftsman", "Beach", "Cottage", "Tropical", "Art Deco", "Whimsical", "Spanish Revival"],
  materials: ["Ceramic & Porcelain", "Porcelain", "Stone", "Marble", "Glass", "Ceramic", "Terrazzo", "Pebble Tile", "Terracotta", "Lava Stone", "Clay Brick", "Cement"],
  looks: ["Stone Look", "Decorative Look", "Marble Look", "Concrete Look", "Solid Color", "Wood Look", "3D", "Subway Tile"],
  finishes: []
};

const MultiSelectGroup = React.memo(({ title, attrKey, options, selected, toggleSelection, allowCustom, customVal, setCustomVal, onAddCustom, onDeleteCustom }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-4">
      <label className="block text-[11px] font-extrabold text-slate-400 mb-3 tracking-widest uppercase">{title}</label>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          const isDefault = DEFAULT_ATTRIBUTES[attrKey]?.includes(opt);
          return (
            <button
              type="button"
              key={opt}
              onClick={() => toggleSelection(opt)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border flex items-center gap-1 ${isSelected
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
          <div className="flex items-center gap-2 mt-1 w-full sm:w-auto">
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
              placeholder="Custom..."
              className="px-3 py-1.5 text-[11px] border border-slate-300 rounded-full outline-none focus:border-blue-500 font-semibold text-slate-800 shadow-sm w-32"
            />
            <button
              type="button"
              onClick={onAddCustom}
              className="px-4 py-1.5 bg-slate-800 text-white text-[11px] font-bold rounded-full hover:bg-black transition-colors shadow-sm"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

const UploadProduct = ({ initialSeries = "" }) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [pricePerSqft, setPricePerSqft] = useState("");
  const [sqftPerBox, setSqftPerBox] = useState("");
  const [price, setPrice] = useState("");
  const [pricingUnit, setPricingUnit] = useState("Box");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [images360, setImages360] = useState([]);

  const [effects, setEffects] = useState([]);
  const [formats, setFormats] = useState([]);
  const [colors, setColors] = useState([]);
  const [tileUses, setTileUses] = useState([]);
  const [styles, setStyles] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [looks, setLooks] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [series, setSeries] = useState(initialSeries);
  const [variationColors, setVariationColors] = useState([]); // Array of objects { name, file, preview }
  const [colorInput, setColorInput] = useState(""); // Temporary input value

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

  const EFFECTS = Array.from(new Set([...DEFAULT_ATTRIBUTES.effects, ...(dbAttributes.effects || [])]));
  const FORMATS = Array.from(new Set([...DEFAULT_ATTRIBUTES.formats, ...(dbAttributes.formats || [])]));
  const COLORS = dbAttributes.colors;
  const TILEUSES = Array.from(new Set([...DEFAULT_ATTRIBUTES.tileUses, ...(dbAttributes.tileUses || [])]));
  const STYLES = Array.from(new Set([...DEFAULT_ATTRIBUTES.styles, ...(dbAttributes.styles || [])]));
  const MATERIALS = Array.from(new Set([...DEFAULT_ATTRIBUTES.materials, ...(dbAttributes.materials || [])]));
  const LOOKS = Array.from(new Set([...DEFAULT_ATTRIBUTES.looks, ...(dbAttributes.looks || [])]));
  const FINISHES = Array.from(new Set([...DEFAULT_ATTRIBUTES.finishes, ...(dbAttributes.finishes || [])]));

  React.useEffect(() => {
    if (initialSeries) {
      setSeries(initialSeries);
    }
  }, [initialSeries]);

  const [colorsList, setColorsList] = useState(COLORS);
  
  React.useEffect(() => {
    setColorsList(COLORS);
  }, [COLORS]);

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

  const handleToggle = React.useCallback((item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  }, []);
  
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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleImages360Change = (e) => {
    const files = Array.from(e.target.files);
    setImages360([...images360, ...files]);
  };

  const removeImage360 = (index) => {
    setImages360(images360.filter((_, i) => i !== index));
  };

  // --- Variation Thumbnail Handlers ---
  const handleColorThumbnailChange = (e, optIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    const newOptions = [...colorOptions];
    newOptions[optIdx] = {
      ...newOptions[optIdx],
      thumbnail: file,
      thumbnailPreview: URL.createObjectURL(file)
    };
    setColorOptions(newOptions);
  };

  const removeColorThumbnail = (optIdx) => {
    const newOptions = [...colorOptions];
    newOptions[optIdx] = {
      ...newOptions[optIdx],
      thumbnail: null,
      thumbnailPreview: null
    };
    setColorOptions(newOptions);
  };

  const [colorOptions, setColorOptions] = useState([]); // [{ color: "", images: [], previews: [], video: null }]

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const finalName = colorOptions.length > 0 ? (colorOptions[0].productName || colorOptions[0].name) : series;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", finalName || "Unnamed Product");
    formData.append("sku", sku);
    formData.append("pricingUnit", pricingUnit);
    formData.append("pricePerSqft", 0);
    formData.append("sqftPerBox", 0);
    formData.append("price", 0);
    formData.append("description", description);
    formData.append("effects", JSON.stringify(effects));
    formData.append("formats", JSON.stringify(formats));
    formData.append("colors", JSON.stringify(colors)); // Still used for filtering
    formData.append("tileUses", JSON.stringify(tileUses));
    formData.append("styles", JSON.stringify(styles));
    formData.append("materials", JSON.stringify(materials));
    formData.append("sizes", JSON.stringify([]));
    formData.append("looks", JSON.stringify(looks));
    formData.append("finishes", JSON.stringify(finishes));
    formData.append("series", series);
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




    let allFiles = [...images.filter(Boolean)];
    let allColorImageFiles = [];
    let allColorVideoFiles = [];
    let allColorThumbnailFiles = [];
    let allColorImages360Files = [];

    const colorOptionsPayload = colorOptions.map(opt => {
      const imageIndices = [];
      opt.images.forEach(img => {
        if (img) {
          imageIndices.push(allColorImageFiles.length);
          allColorImageFiles.push(img);
        }
      });

      let videoIndex = undefined;
      if (opt.video) {
        videoIndex = allColorVideoFiles.length;
        allColorVideoFiles.push(opt.video);
      }

      let thumbnailIndex = undefined;
      if (opt.thumbnail) {
        thumbnailIndex = allColorThumbnailFiles.length;
        allColorThumbnailFiles.push(opt.thumbnail);
      }

      const images360Indices = [];
      if (opt.images360 && opt.images360.length > 0) {
        opt.images360.forEach(f => {
          if (f) {
            images360Indices.push(allColorImages360Files.length);
            allColorImages360Files.push(f);
          }
        });
      }

      return {
        colors: opt.colors || (opt.color ? [opt.color] : []),
        shapes: opt.shapes || [],
        shape: opt.shape || "",
        mosaici: opt.mosaici || [],
        name: opt.name,
        sku: opt.sku || "",
        pricingUnit: opt.pricingUnit || "Box",
        productName: opt.productName || "",
        price: opt.price,
        pricePerSqft: Number(opt.pricePerSqft),
        sqftPerBox: Number(opt.sqftPerBox),
        sizes: opt.sizes || [],
        description: opt.description,
        imageIndices,
        videoIndex,
        thumbnailIndex,
        images360Indices
      };
    });

    formData.append("colorOptions", JSON.stringify(colorOptionsPayload));

    if (video) {
      formData.append("video", video);
    }

    // Append all collected images
    allFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Append all collected color images
    allColorImageFiles.forEach((file) => {
      formData.append("colorImages", file);
    });

    // Append all collected color videos
    allColorVideoFiles.forEach((file) => {
      formData.append("colorVideos", file);
    });

    // Append all collected color thumbnails
    allColorThumbnailFiles.forEach((file) => {
      formData.append("colorThumbnails", file);
    });

    // Append all collected color 360 images
    allColorImages360Files.forEach((file) => {
      formData.append("colorImages360", file);
    });

    // Append 360 images
    images360.forEach((file) => {
      formData.append("images360", file);
    });

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        showToast('success', `"${name}" uploaded successfully! 🎉`);
      } else {
        const errorData = await response.json();
        showToast('error', errorData.message || 'Failed to publish product. Try again.');
      }
    } catch (err) {
      showToast('error', 'Could not connect to the Backend server. Please check if backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 relative">

      {/* Full-screen loader overlay while uploading */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex flex-col items-center justify-center">
          <TileLoader />
          <p className="mt-6 text-white font-black text-lg uppercase tracking-widest animate-pulse">Uploading Product...</p>
          <p className="text-white/50 font-medium text-sm mt-2">Photos are being saved.... ☁️</p>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[1000] flex items-start gap-4 px-6 py-5 rounded-2xl shadow-2xl min-w-[320px] max-w-[420px] transition-all animate-in slide-in-from-top-4 duration-500 ${toast.type === 'success'
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
          }`}>
          <div className="text-3xl mt-0.5">
            {toast.type === 'success' ? '✅' : '❌'}
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-widest mb-1">
              {toast.type === 'success' ? 'Product Uploaded!' : 'Upload Failed'}
            </p>
            <p className="font-medium text-sm opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-auto text-white/70 hover:text-white text-xl font-black leading-none mt-0.5"
          >✕</button>
        </div>
      )}

      <div className="mb-8 border-b border-slate-100 pb-6">
        <h3 className="text-2xl font-black text-slate-800">Upload Product</h3>
        <p className="text-slate-500 font-medium mt-2">Fill in the product details precisely using the options below.</p>
      </div>

      <form className="space-y-8 max-w-5xl" onSubmit={handlePublish}>





        {/* OPTIONS VIEW COLLECTION (COLOR SPECIFIC) */}
        <ColorOptionsManager 
          colorOptions={colorOptions} 
          setColorOptions={setColorOptions} 
          handleColorThumbnailChange={handleColorThumbnailChange}
          removeColorThumbnail={removeColorThumbnail}
          parentPricingUnit={pricingUnit}
          availableColors={variationColors.map(c => c.name)}
        />



        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Main SKU / Tile Code</label>
            <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800 text-lg shadow-sm" placeholder="e.g. GL-701" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Main Pricing Unit & Available Colors (w/ Icons)</label>
            <div className="flex flex-wrap gap-4 items-start focus-within:ring-0">
              <select 
                value={pricingUnit} 
                onChange={e => setPricingUnit(e.target.value)} 
                className="w-1/3 bg-white border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800 text-lg shadow-sm cursor-pointer"
              >
                <option value="Box">Box</option>
                <option value="Sheet">Sheet</option>
              </select>
              
              <div className="flex-1 min-w-[280px]">
                <div className="flex bg-white border border-slate-300 rounded-xl px-4 py-2 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm min-h-[58px]">
                  <div className="flex flex-wrap gap-2 items-center flex-1">
                    {variationColors.map((colorObj, idx) => (
                        <div key={colorObj.name} className="bg-slate-50 border border-slate-200 p-1 rounded-full flex items-center gap-2 pr-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 overflow-hidden relative group/icon">
                                {colorObj.preview ? (
                                    <img src={colorObj.preview} alt={colorObj.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase">Img</div>
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
                                  setVariationColors([...variationColors, { name: val, file: null, preview: null }]);
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
            </div>
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Main Category Type</label>
                <select value={productCategory} onChange={e => setProductCategory(e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 shadow-sm cursor-pointer">
                  <option>Shop by Effects</option>
                  <option>Shop by Formats</option>
                  <option>Shop by Colours</option>
                  <option>Shop by Collections</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Series / Collection <span className="text-blue-500 text-[10px] uppercase font-black ml-2 tracking-widest">(Optional)</span></label>
                <select 
                  value={series} 
                  onChange={e => setSeries(e.target.value)} 
                  className={`w-full border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 shadow-sm cursor-pointer ${series ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-300'}`}
                >
                  <option value="">Select a Collection</option>
                  {COLLECTIONS.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
          </div>
        </div>



        {/* FILTERS */}
        <div className="space-y-0">
          <MultiSelectGroup 
            title="Shop by Effect" 
            attrKey="effects"
            options={EFFECTS} 
            selected={effects} 
            toggleSelection={(val) => handleToggle(val, effects, setEffects)}
            allowCustom={true}
            customVal={customEffect}
            setCustomVal={setCustomEffect}
            onAddCustom={() => handleAddCustomAttribute("effects", customEffect, setCustomEffect)}
            onDeleteCustom={(val) => handleDeleteCustomAttribute("effects", val)}
          />
          <MultiSelectGroup 
            title="Shop by Format" 
            attrKey="formats"
            options={FORMATS} 
            selected={formats} 
            toggleSelection={(val) => handleToggle(val, formats, setFormats)}
            allowCustom={true}
            customVal={customFormat}
            setCustomVal={setCustomFormat}
            onAddCustom={() => handleAddCustomAttribute("formats", customFormat, setCustomFormat)}
            onDeleteCustom={(val) => handleDeleteCustomAttribute("formats", val)}
          />
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
          <MultiSelectGroup 
            title="Finishes" 
            attrKey="finishes"
            options={FINISHES} 
            selected={finishes} 
            toggleSelection={(val) => handleToggle(val, finishes, setFinishes)}
            allowCustom={true}
            customVal={customFinish}
            setCustomVal={setCustomFinish}
            onAddCustom={() => handleAddCustomAttribute("finishes", customFinish, setCustomFinish)}
            onDeleteCustom={(val) => handleDeleteCustomAttribute("finishes", val)}
          />
        </div>

        {/* SUBMIT */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-center sticky bottom-0 bg-white/95 backdrop-blur-md pb-4 z-10 -mx-10 px-10 rounded-b-3xl">
          <button type="button" className="px-6 py-3 text-slate-500 hover:text-red-500 font-bold transition-colors">Discard</button>
          <button type="submit" disabled={isSubmitting} className={`px-10 py-4 ${isSubmitting ? 'bg-slate-600' : 'bg-slate-900 hover:bg-black'} text-white rounded-xl font-black tracking-wider shadow-xl shadow-slate-900/30 transition-all hover:-translate-y-1 uppercase text-sm`}>
            {isSubmitting ? 'Publishing...' : 'Publish & Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProduct;