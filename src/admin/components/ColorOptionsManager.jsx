import React, { useRef, useState } from "react";
import { getImageUrl } from "../../utils/imageUtils";

const AVAILABLE_COLOURS = [
  "Azul", "Beige", "Black", "Blue", "Bronze", "Brown", "Dark Grey", "Grey", "Metallic Brown", "White"
];

const AVAILABLE_SHAPES = [
  "Chevron", "Herringbone", "Hexagon", "Pickets", "Planks", 
  "Rectangle", "Rhombus", "Square", "Trapezium", "Triangle", "Woven Square"
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

const ColorOptionsManager = ({ 
  colorOptions, 
  setColorOptions, 
  handleColorThumbnailChange, 
  removeColorThumbnail,
  availableColors = [],
  parentPricingUnit = "Box"
}) => {
  const [showColorsShapes, setShowColorsShapes] = useState({});
  const newCardRef = useRef(null);
  const noEnter = (e) => { if (e.key === 'Enter') e.preventDefault(); };

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

  React.useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attributes`);
        if (res.ok) {
          const data = await res.json();
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

  const handleAddColorOption = () => {
    setColorOptions([
      ...colorOptions,
      { 
        sku: "",
        colors: [], 
        shapes: [],
        shape: "",
        mosaici: [],
        effects: [],
        formats: [],
        finishes: [],
        name: "", 
        productName: "", 
        pricePerSqft: "", 
        sqftPerBox: "", 
        price: "", 
        sizes: [], 
        description: "", 
        images: [], 
        previews: [], 
        video: null,
        thumbnail: null,
        thumbnailPreview: null,
        pricingUnit: parentPricingUnit,
        images360: [],
        newImages360: [],
        existingImages360: []
      },
    ]);
    setTimeout(() => {
      if (newCardRef.current) newCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleVariationPriceSqftChange = (idx, val) => {
    const updated = [...colorOptions];
    updated[idx].pricePerSqft = val;
    if (val && updated[idx].sqftPerBox) updated[idx].price = (parseFloat(val) * parseFloat(updated[idx].sqftPerBox)).toFixed(2);
    else updated[idx].price = "";
    setColorOptions(updated);
  };

  const handleVariationSqftBoxChange = (idx, val) => {
    const updated = [...colorOptions];
    updated[idx].sqftPerBox = val;
    if (val && updated[idx].pricePerSqft) updated[idx].price = (parseFloat(val) * parseFloat(updated[idx].pricePerSqft)).toFixed(2);
    else updated[idx].price = "";
    setColorOptions(updated);
  };

  const handleRemoveColorOption = (idx) => setColorOptions(colorOptions.filter((_, i) => i !== idx));

  const handleColorFieldChange = (idx, field, val) => {
    const updated = [...colorOptions];
    updated[idx] = { ...updated[idx], [field]: val };
    setColorOptions(updated);
  };

  const handleColorImageChange = (e, optIdx, imgIdx) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const updated = [...colorOptions];
    const newImages = [...(updated[optIdx].images || [])];
    const newPreviews = [...(updated[optIdx].previews || [])];
    newImages[imgIdx] = files[0];
    newPreviews[imgIdx] = URL.createObjectURL(files[0]);
    updated[optIdx] = { ...updated[optIdx], images: newImages, previews: newPreviews };
    setColorOptions(updated);
  };

  const handleColorVideoChange = (e, optIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...colorOptions];
    updated[optIdx] = { ...updated[optIdx], video: file };
    setColorOptions(updated);
  };

  const removeColorVideo = (optIdx) => {
    const updated = [...colorOptions];
    updated[optIdx] = { ...updated[optIdx], video: null };
    setColorOptions(updated);
  };

  const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-600 bg-white shadow-sm";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 italic";

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h4 className="text-sm font-black text-gray-800 uppercase tracking-tighter">Variations & Pricing</h4>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Manage galleries and sizes for each variation</p>
        </div>
        <button
          type="button"
          onClick={handleAddColorOption}
          className="bg-slate-900 text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 rounded-full shadow-lg"
        >
          <span>+</span> Add New Variation
        </button>
      </div>

      {/* Variation Cards */}
      <div className="space-y-6">
        {colorOptions.map((option, optIdx) => (
          <div
            key={optIdx}
            ref={optIdx === colorOptions.length - 1 ? newCardRef : null}
            className="border border-gray-200 bg-white p-6 relative rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Remove toggle */}
            <button
              type="button"
              onClick={() => handleRemoveColorOption(optIdx)}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-20 text-lg font-black"
            >
              ✕
            </button>

            {/* Row 1: Basic fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className={labelClass}>Variation Name</label>
                <input type="text" value={option.name} onChange={(e) => handleColorFieldChange(optIdx, "name", e.target.value)} onKeyDown={noEnter} className={inputClass} placeholder="e.g. Polished Slabs" />
              </div>

              <div>
                <label className={labelClass}>SKU Code / Tile Code</label>
                <input type="text" value={option.sku || ""} onChange={(e) => handleColorFieldChange(optIdx, "sku", e.target.value)} onKeyDown={noEnter} className={inputClass} placeholder="e.g. GL-701-W" />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Colors, Shapes, Mosaici & Attributes</label>
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
                        {Array.from(new Set([...availableColours, ...(availableColors || [])])).map((color) => {
                          const isSelected = Array.isArray(option.colors) && option.colors.includes(color);
                          const isDefaultColor = [].includes(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                const current = Array.isArray(option.colors) ? option.colors : [];
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
                          const isSelected = Array.isArray(option.shapes) && option.shapes.includes(shape);
                          const isDefaultShape = [].includes(shape);
                          return (
                            <button
                              key={shape}
                              type="button"
                              onClick={() => {
                                const current = Array.isArray(option.shapes) ? option.shapes : [];
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
                      <div className="flex flex-wrap gap-1.5">
                        {availableMosaici.map((mos) => {
                          const isSelected = Array.isArray(option.mosaici) && option.mosaici.includes(mos);
                          const isDefaultMosaici = [].includes(mos);
                          return (
                            <button
                              key={mos}
                              type="button"
                              onClick={() => {
                                const current = Array.isArray(option.mosaici) ? option.mosaici : [];
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
                          const isSelected = Array.isArray(option.effects) && option.effects.includes(eff);
                          const isDefaultEffect = [].includes(eff);
                          return (
                            <button
                              key={eff}
                              type="button"
                              onClick={() => {
                                const current = Array.isArray(option.effects) ? option.effects : [];
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
                          const isSelected = Array.isArray(option.formats) && option.formats.includes(form);
                          const isDefaultFormat = [].includes(form);
                          return (
                            <button
                              key={form}
                              type="button"
                              onClick={() => {
                                const current = Array.isArray(option.formats) ? option.formats : [];
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
                          const isSelected = Array.isArray(option.finishes) && option.finishes.includes(fin);
                          const isDefaultFinish = [].includes(fin);
                          return (
                            <button
                              key={fin}
                              type="button"
                              onClick={() => {
                                const current = Array.isArray(option.finishes) ? option.finishes : [];
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
              
              {/* Swatch / Thumbnail Slot */}
              <div className="flex flex-col items-center">
                <label className={labelClass}>Swatch Icon</label>
                <div className="aspect-square w-14 border-2 border-dashed border-blue-200 rounded-xl relative overflow-hidden bg-white hover:border-blue-500 transition-all flex items-center justify-center group/swatch shadow-sm">
                  {option.thumbnailPreview || option.existingThumbnail ? (
                    <>
                      <img src={option.thumbnailPreview || getImageUrl(option.existingThumbnail)} alt="swatch" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); removeColorThumbnail(optIdx); }}
                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover/swatch:opacity-100 transition-all flex items-center justify-center text-white text-xs font-black"
                      >✕</button>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-400 text-lg font-light leading-none">+</span>
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
                <label className={labelClass}>Collection Title (Override)</label>
                <input type="text" value={option.productName || ""} onChange={(e) => handleColorFieldChange(optIdx, "productName", e.target.value)} onKeyDown={noEnter} className={inputClass} placeholder="Variation Product Title" />
              </div>

              <div>
                <label className={labelClass}>Price / Sq.Ft (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 text-sm">₹</span>
                  <input type="number" step="0.01" value={option.pricePerSqft || ""} onChange={(e) => handleVariationPriceSqftChange(optIdx, e.target.value)} onKeyDown={noEnter} className={`${inputClass} pl-7`} placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Sq.Ft / {option.pricingUnit || "Box"}</label>
                <input type="number" step="0.01" value={option.sqftPerBox || ""} onChange={(e) => handleVariationSqftBoxChange(optIdx, e.target.value)} onKeyDown={noEnter} className={inputClass} placeholder="e.g. 15.5" />
              </div>

              <div>
                <label className={labelClass}>Pricing Unit</label>
                <select 
                  value={option.pricingUnit || "Box"} 
                  onChange={(e) => handleColorFieldChange(optIdx, "pricingUnit", e.target.value)} 
                  className={inputClass}
                >
                  <option value="Box">Box</option>
                  <option value="Sheet">Sheet</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Total Price/{option.pricingUnit || "Box"}</label>
                <div className="border border-gray-200 px-3 py-2 bg-gray-50 text-sm font-bold text-gray-800 rounded-lg">
                  ₹ {option.price || "0.00"}
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className={labelClass}>Sizes (Enter to add)</label>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val) {
                        const current = Array.isArray(option.sizes) ? option.sizes : [];
                        if (!current.includes(val)) handleColorFieldChange(optIdx, "sizes", [...current, val]);
                        e.target.value = "";
                      }
                    }
                  }}
                  className={inputClass}
                  placeholder="Type size and press Enter"
                />
                {option.sizes?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {option.sizes.map((sz, i) => (
                      <span key={i} className="flex items-center gap-1 border border-gray-200 bg-gray-50 px-3 py-1 rounded-full text-[10px] font-bold text-gray-700">
                        {sz}
                        <button type="button" onClick={() => handleColorFieldChange(optIdx, "sizes", option.sizes.filter(s => s !== sz))} className="text-gray-400 hover:text-red-500 ml-1">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Gallery and Meta */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <label className={labelClass}>Gallery Description</label>
                <textarea 
                   value={option.description} 
                   onChange={(e) => handleColorFieldChange(optIdx, "description", e.target.value)} 
                   className={`${inputClass} min-h-[100px] resize-none rounded-xl`} 
                   placeholder="Special details for this variation..." 
                 />
              </div>

              <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Variation Video */}
                <div>
                  <label className={labelClass}>Variation Video</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl relative cursor-pointer hover:border-blue-400 transition-all bg-slate-50 h-24 flex items-center justify-center overflow-hidden group/vid">
                    {option.video ? (
                      <div className="text-center px-4 w-full">
                        <p className="text-[10px] text-blue-600 font-black truncate">{option.video.name}</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeColorVideo(optIdx); }} className="absolute inset-0 bg-red-500/90 opacity-0 group-hover/vid:opacity-100 transition-all flex items-center justify-center text-white text-[10px] font-black">REPLACE VIDEO</button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Upload Video</span>
                    )}
                    <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleColorVideoChange(e, optIdx)} />
                  </div>
                </div>

                {/* Variation 360 View */}
                <div>
                  <label className={labelClass}>360° View Frames</label>
                  <div className="border border-dashed border-purple-300 rounded-xl relative cursor-pointer hover:border-purple-500 transition-all bg-purple-50 h-24 flex items-center justify-center overflow-hidden group/360">
                    {(option.images360 && option.images360.length > 0) || (option.newImages360 && option.newImages360.length > 0) || (option.existingImages360 && option.existingImages360.length > 0) ? (
                      <div className="text-center px-4 w-full">
                        <p className="text-[11px] text-purple-600 font-black truncate uppercase tracking-widest">
                          {((option.images360?.length || 0) + (option.newImages360?.length || 0) + (option.existingImages360?.length || 0))} Frames
                        </p>
                        <button type="button" onClick={(e) => { 
                          e.stopPropagation(); 
                          handleColorFieldChange(optIdx, "images360", []);
                          handleColorFieldChange(optIdx, "newImages360", []);
                          handleColorFieldChange(optIdx, "existingImages360", []);
                        }} className="absolute inset-0 bg-red-500/90 opacity-0 group-hover/360:opacity-100 transition-all flex items-center justify-center text-white text-[10px] font-black underline">REMOVE ALL</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-purple-400 pointer-events-none">
                        <span className="text-xl mb-1">↻</span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-center px-1">Upload Frames</span>
                      </div>
                    )}
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                       const files = Array.from(e.target.files);
                       if (files.length > 0) {
                          // Depending on parent (QuickAdd vs EditProduct), we supply differently. 
                          // Safe way is assign to images360 (QuickAdd) AND newImages360 (EditProduct)
                          const updated = [...colorOptions];
                          updated[optIdx] = { ...updated[optIdx], images360: files, newImages360: files };
                          setColorOptions(updated);
                       }
                    }} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <label className={labelClass}>Gallery Images (Max 8)</label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {[0,1,2,3,4,5,6,7].map((imgIdx) => (
                    <div key={imgIdx} className="aspect-square border-2 border-dashed border-slate-200 rounded-xl relative overflow-hidden cursor-pointer hover:border-blue-400 transition-all bg-slate-50 flex items-center justify-center group/img shadow-inner">
                      {option.previews?.[imgIdx] ? (
                        <div className="relative w-full h-full">
                          <img src={option.previews[imgIdx]} alt="preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="text-[10px] text-white font-black">CHANGE</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xl font-light">+</span>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleColorImageChange(e, optIdx, imgIdx)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {colorOptions.length === 0 && (
          <div className="py-16 border-4 border-dashed border-gray-100 rounded-[32px] text-center bg-gray-50/50">
             <div className="text-4xl mb-4 opacity-20">🎨</div>
             <p className="text-slate-400 font-black text-xs uppercase tracking-widest italic">Prepare your variations here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorOptionsManager;
