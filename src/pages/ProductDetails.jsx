import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiStar, HiMinus, HiPlus, HiX } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import RelatedProducts from '../components/RelatedProducts';
import ThreeSixtyViewer from '../components/ThreeSixtyViewer';
import { getImageUrl } from '../utils/imageUtils';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, openCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [activeColorFilter, setActiveColorFilter] = useState(null);

  // ... calculator state remains ...

  // --- Calculator State ---
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calcUnit, setCalcUnit] = useState('Feet'); // Feet or Inches
  const [calcLength, setCalcLength] = useState("");
  const [calcWidth, setCalcWidth] = useState("");
  const [calcMessage, setCalcMessage] = useState("");

  const [wastagePercentage, setWastagePercentage] = useState(15); // 0, 10, or 15
  const [inputSqft, setInputSqft] = useState("");
  const [inputBoxes, setInputBoxes] = useState("");

  const handleWastageChange = (pct) => {
    setWastagePercentage(pct);
    const sqftBox = (selectedOption && selectedOption.sqftPerBox) ? selectedOption.sqftPerBox : (product?.sqftPerBox || 5.38);
    if (inputSqft) {
      const area = parseFloat(inputSqft);
      const multiplier = 1 + (pct / 100);
      const boxes = Math.ceil((area * multiplier) / sqftBox);
      setInputBoxes(boxes);
    }
  };

  const handleSqftChange = (val) => {
    setInputSqft(val);
    const sqftBox = (selectedOption && selectedOption.sqftPerBox) ? selectedOption.sqftPerBox : (product?.sqftPerBox || 5.38);
    if (!val || isNaN(parseFloat(val))) {
      if (!val) setInputBoxes("");
      return;
    }
    const area = parseFloat(val);
    const multiplier = 1 + (wastagePercentage / 100);
    const boxes = Math.ceil((area * multiplier) / sqftBox);
    setInputBoxes(boxes);
  };

  const handleBoxesChange = (val) => {
    setInputBoxes(val);
    const sqftBox = (selectedOption && selectedOption.sqftPerBox) ? selectedOption.sqftPerBox : (product?.sqftPerBox || 5.38);
    if (!val || isNaN(parseInt(val, 10))) {
      if (!val) setInputSqft("");
      return;
    }
    const boxes = parseInt(val, 10);
    const multiplier = 1 + (wastagePercentage / 100);
    const area = (boxes * sqftBox) / multiplier;
    setInputSqft(area.toFixed(2));
  };

  const handleCalculate = () => {
    const L = calcUnit === 'Feet' ? parseFloat(calcLength) : parseFloat(calcLength) / 12;
    const W = calcUnit === 'Feet' ? parseFloat(calcWidth) : parseFloat(calcWidth) / 12;
    const sqftBox = (selectedOption && selectedOption.sqftPerBox) ? selectedOption.sqftPerBox : (product?.sqftPerBox || 5.38);

    if (!isNaN(L) && !isNaN(W) && L > 0 && W > 0) {
      const area = L * W;

      const baseBoxes = Math.ceil(area / sqftBox);
      const extraBoxes15 = Math.ceil((area * 1.15) / sqftBox);

      setInputSqft(area.toFixed(2));
      setInputBoxes(extraBoxes15);
      setWastagePercentage(15);
      setCalcMessage(`You need ${baseBoxes} boxes. We recommend that you order ${extraBoxes15} boxes (15% extra) to cover cuts and future repairs.`);
    } else {
      alert('Please enter valid length and width');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);

        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        // Do not auto-select color option so General Product Visuals are displayed initially
        // if (data.colors && data.colors.length > 0) {
        //   setSelectedColor(data.colors[0]);
        // }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle URL-based variation selection
  useEffect(() => {
    if (product && product.colorOptions && product.colorOptions.length > 0) {
      const vParam = searchParams.get('v');
      const idxParam = searchParams.get('idx');
      
      let index = 0;
      if (idxParam !== null) {
        index = parseInt(idxParam, 10);
      } else if (vParam) {
        const foundIdx = product.colorOptions.findIndex(opt => {
          const optColors = Array.isArray(opt.colors) ? opt.colors : (opt.color ? [opt.color] : []);
          return (opt.name?.toLowerCase() === vParam.toLowerCase()) || 
                 (opt.sku?.toLowerCase() === vParam.toLowerCase()) ||
                 optColors.some(c => c?.toLowerCase() === vParam.toLowerCase());
        });
        if (foundIdx !== -1) index = foundIdx;
      } else if (id && id.includes("-")) {
        const parts = id.split("-");
        const parsedIdx = parseInt(parts[1], 10);
        if (!isNaN(parsedIdx) && product.colorOptions[parsedIdx]) {
          index = parsedIdx;
        }
      }
      
      if (product.colorOptions[index]) {
         setSelectedOptionIndex(index);
         const option = product.colorOptions[index];
         setSelectedImage(1); 
         if (option.sizes && option.sizes.length > 0) setSelectedSize(option.sizes[0]);
         else if (option.size) setSelectedSize(option.size);
      }
    }
  }, [product, searchParams, id]);

  const handleAddToCart = () => {
    if (product) {
      const qty = parseInt(inputBoxes, 10) || 1;

      // Calculate active base price (variation sqft price or general sqft/box price)
      let baseBoxPrice = product.price || ((product.pricePerSqft || 0) * (product.sqftPerBox || 5.38)) || 0;
      if (selectedOption && selectedOption.price) {
        // ensure price falls back to sqft calculation if total price not present
        baseBoxPrice = selectedOption.price || (selectedOption.pricePerSqft * selectedOption.sqftPerBox) || 0;
      }

      const productForCart = { 
        ...product, 
        _id: selectedOption?.parentId || product._id,
        price: baseBoxPrice, 
        pricingUnit 
      };
      const optColors = Array.isArray(selectedOption?.colors) ? selectedOption.colors : (selectedOption?.color ? [selectedOption.color] : []);
      const colorToAdd = optColors[0] || null;
      addToCart(productForCart, qty, selectedSize, colorToAdd);
      openCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Loading Product Details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-black text-gray-800 mb-4">Oops!</h2>
        <p className="text-gray-500 mb-6">{error || "Product could not be loaded."}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700">Go Back</button>
      </div>
    );
  }

  // Derived state
  const selectedOption = product?.colorOptions?.[selectedOptionIndex] || null;
  
  const optionSizes = selectedOption ? [
    ...(selectedOption.sizes || []), 
    ...(selectedOption.size ? [selectedOption.size] : [])
  ] : [];

  // Determine which images and video to show in the gallery
  const galleryImages = (selectedOption && selectedOption.images && selectedOption.images.length > 0)
    ? selectedOption.images
    : (product.images || []);

  const variantVideo = selectedOption?.video;
  const mainVideo = product.video;
  const activeVideo = variantVideo || mainVideo;
  const hasVideo = !!activeVideo;

  const activeImages360 = (selectedOption && selectedOption.images360 && selectedOption.images360.length > 0)
    ? selectedOption.images360
    : (product.images360 || []);
  const has360 = activeImages360.length > 0;

  const images = galleryImages.length > 0
    ? galleryImages.map(img => getImageUrl(img))
    : ["/products/default.jpg"];

  // Centralized pricing unit logic - Be aggressive with 'Sheet' detection
  // If either the main product OR the selected variation is set to Sheet, use Sheet.
  console.log("DEBUG ProductDetails:", {
    productName: product?.name,
    productSku: product?.sku,
    selectedOptionIndex,
    selectedOption,
    resolvedSku: selectedOption?.sku || product?.sku
  });

  const pricingUnit = (
    (product.pricingUnit?.toLowerCase() === "sheet") || 
    (selectedOption?.pricingUnit?.toLowerCase() === "sheet")
  ) ? "sheet" : "box";

  return (
    <div className="bg-white min-h-screen pb-20">

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="max-w-[1400px] mx-auto px-6 text-sm text-gray-500 font-medium">
          <span className="hover:text-black cursor-pointer uppercase text-xs tracking-wider" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-black cursor-pointer uppercase text-xs tracking-wider" onClick={() => navigate(-1)}>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-black font-bold uppercase text-xs tracking-wider">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* Gallery Section - 2 Column Grid */}
          <div className="w-full lg:w-[70%]">
            <div className="grid grid-cols-2 gap-2">
              {/* Video Card */}
              {hasVideo && (
                <div className="col-span-2 md:col-span-1 bg-gray-50 border border-gray-100 relative aspect-square flex items-center justify-center p-2 rounded-none overflow-hidden shadow-inner">
                  <video
                    key={activeVideo}
                    src={getImageUrl(activeVideo)}
                    controls
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  ></video>
                </div>
              )}

              {/* 360 View Card */}
              {has360 && (
                <div className="col-span-2 md:col-span-1 bg-gray-50 border border-gray-100 relative aspect-square flex items-center justify-center rounded-none overflow-hidden shadow-inner">
                  <ThreeSixtyViewer images={activeImages360} />
                </div>
              )}

              {/* Image Cards */}
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-50 border border-gray-100 relative aspect-square flex items-center justify-center rounded-none overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <img src={img} alt={`Product view ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {idx === 0 && (
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
                        isInWishlist(product._id) ? 'text-red-500 hover:scale-110' : 'text-gray-500 hover:text-red-500 hover:scale-110'
                      }`}
                    >
                      {isInWishlist(product._id) ? <HiHeart className="text-xl" /> : <HiOutlineHeart className="text-xl" />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-[30%] flex flex-col py-4">
            <h1 className="text-[18px] font-bold text-gray-950 leading-tight mb-4 tracking-tight">
              {/* Show only Collection Name if selected, otherwise main product name */}
              {selectedOption?.productName || product.name}
            </h1>

            {/* SKU Display */}
            {(selectedOption?.sku || product.sku) && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">SKU:</span>
                <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  {selectedOption?.sku || product.sku}
                </span>
              </div>
            )}

            {/* Add Sample Button */}
            {selectedOption && (
              <div className="mb-6">
                <button 
                  onClick={() => {
                    addToCart({
                      ...product,
                      price: 0,
                      isSample: true
                    }, 1, selectedSize, selectedOption.colors?.[0] || selectedOption.color, true);
                    openCart();
                  }}
                  className="bg-[#e4e2d9] text-gray-950 tracking-widest text-sm font-medium px-6 py-4 uppercase hover:bg-[#d6d3c8] transition-all rounded-none w-full shadow-sm">
                  ORDER SAMPLE +
                </button>
              </div>
            )}

            {/* Price Display */}
            {(selectedOption?.pricePerSqft || product.pricePerSqft) > 0 && (() => {
              const currentPricePerSqft = selectedOption?.pricePerSqft || product.pricePerSqft || 0;
              const currentSqftPerBox = selectedOption?.sqftPerBox || product.sqftPerBox || 0;
              const currentPricePerBox = selectedOption?.price || product.price || (currentPricePerSqft * currentSqftPerBox);
              
              return (
                <div className="mb-6 border-t border-b border-gray-100 py-4">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1.5 text-gray-600 flex-wrap">
                      <span className="text-sm font-normal text-gray-900">
                        ₹{currentPricePerBox.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs font-normal text-gray-500">per {pricingUnit.toLowerCase()}</span>
                      {currentSqftPerBox > 0 && (
                        <span className="text-xs font-normal text-gray-500">
                          ({currentSqftPerBox} sq. ft.)
                        </span>
                      )}
                    </div>
                    <div className="text-[18px] font-bold text-gray-900">
                      ₹{currentPricePerSqft.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal text-gray-400">/ sq. ft.</span>
                    </div>
                  </div>
                </div>
              );
            })()}



            {/* COLOR SWATCHES + OPTIONS VIEW COLLECTION */}
            {product.colorOptions && product.colorOptions.length > 0 && (() => {
              // Step 1: Extract unique colors and sizes from all colorOptions
              const colorMap = { "light grey": "#b0b0b0", "dark grey": "#555", "white": "#f5f5f5", "black": "#111", "beige": "#d4b896", "brown": "#8B5E3C", "blue": "#2563eb", "red": "#dc2626", "green": "#16a34a", "orange": "#ea580c", "yellow": "#ca8a04", "pink": "#ec4899", "purple": "#9333ea", "grey": "#9ca3af", "gray": "#9ca3af" };

              const uniqueColors = Array.from(new Set(
                product.colorOptions.flatMap(opt => Array.isArray(opt.colors) ? opt.colors : (opt.color ? [opt.color] : []))
              ));

              const allUniqueSizes = Array.from(new Set(
                [...(product.sizes || []), ...product.colorOptions.flatMap(opt => [...(opt.sizes || []), ...(opt.size ? [opt.size] : [])])]
              ));

              // Step 2: Filter variations by color and selected size
              const visibleOptions = product.colorOptions.filter(opt => {
                const optColors = Array.isArray(opt.colors) ? opt.colors : (opt.color ? [opt.color] : []);
                
                // Matches color filter if active
                const matchesColor = !activeColorFilter || optColors.some(c => c.toLowerCase().trim() === activeColorFilter.toLowerCase().trim());
                
                // Matches size filter: if selectedSize is set, variation must support it
                let matchesSize = true;
                if (selectedSize) {
                  const optSizes = Array.isArray(opt.sizes) ? opt.sizes : (opt.size ? [opt.size] : []);
                  matchesSize = optSizes.some(s => s.toLowerCase().trim() === selectedSize.toLowerCase().trim());
                }
                
                return matchesColor && matchesSize;
              });

              return (
                <div className="mb-10">
                  {/* Color Swatches */}


                  {/* Options / View Collection */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-3 mb-4">
                      <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900">Options</h3>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest underline underline-offset-4 cursor-pointer hover:text-black transition-colors">View Collection</span>

                    </div>

                    <div className="flex flex-wrap gap-4 relative pb-4 items-start pt-1">
                      {visibleOptions.map((option) => {
                        const actualIdx = product.colorOptions.indexOf(option);
                        const isSelected = selectedOptionIndex === actualIdx;
                        const isHovered = hoveredOption === actualIdx;

                        return (
                          <div
                            key={actualIdx}
                            className="flex flex-col items-center gap-2 group/opt shrink-0 transition-all duration-300"
                            onMouseEnter={() => setHoveredOption(actualIdx)}
                            onMouseLeave={() => setHoveredOption(null)}
                          >
                            <button
                              onClick={() => {
                                setSelectedOptionIndex(actualIdx);
                                setSelectedImage(1);
                                const optColors = Array.isArray(option.colors) ? option.colors : (option.color ? [option.color] : []);
                                setSearchParams({ v: option.name || optColors[0] || option.sku, idx: actualIdx }, { replace: true });
                                
                                // Auto-update selectedSize if the clicked variation does not support the current selectedSize
                                const optSizes = (Array.isArray(option.sizes) && option.sizes.length > 0)
                                  ? option.sizes
                                  : (option.size ? [option.size] : (product.sizes || []));
                                if (optSizes.length > 0 && !optSizes.includes(selectedSize)) {
                                  setSelectedSize(optSizes[0]);
                                }
                              }}
                              className={`w-14 h-14 flex-shrink-0 border-2 transition-all duration-300 relative overflow-hidden flex items-center justify-center p-0.5 rounded-sm ${isSelected
                                ? 'border-black shadow-none'
                                : 'border-gray-200 bg-white shadow-none hover:border-black'
                                }`}
                            >
                              <div className="w-full h-full overflow-hidden rounded-sm">
                                <img
                                  src={getImageUrl(
                                    product.variationColors?.find(vc => vc.name === (Array.isArray(option.colors) ? option.colors[0] : option.color))?.image || 
                                    option.thumbnail || 
                                    option.images?.[0]
                                  )}
                                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isSelected ? 'scale-110' : 'group-hover/opt:scale-125'
                                    }`}
                                  alt={option.name || (Array.isArray(option.colors) ? option.colors.join(', ') : option.color)}
                                />
                              </div>
                              {isSelected && (
                                <div className="absolute inset-0 border-2 border-gray-900 rounded-sm pointer-events-none" />
                              )}
                            </button>

                            <span
                              className={`text-[9px] font-medium uppercase tracking-[0.1em] text-center w-16 truncate transition-colors ${isSelected ? 'text-black font-bold' : 'text-gray-400 group-hover/opt:text-gray-700'
                                }`}
                              title={option.name || (Array.isArray(option.colors) ? option.colors.join(', ') : option.color)}
                            >
                              {option.name || (Array.isArray(option.colors) ? option.colors.join(', ') : option.color)}
                            </span>

                            {isHovered && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 bg-white shadow-2xl rounded-sm border border-gray-100 overflow-hidden pointer-events-none">
                                <div className="aspect-square w-full">
                                  <img
                                    src={getImageUrl(option.images?.[0])}
                                    className="w-full h-full object-cover"
                                    alt="preview"
                                  />
                                </div>
                                <div className="bg-gray-900 text-white py-2 px-3 text-center">
                                  <span className="text-[10px] font-medium uppercase tracking-widest">
                                    {option.name || (Array.isArray(option.colors) ? option.colors.join(', ') : option.color)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {visibleOptions.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No variations found for these filters.</p>
                      )}
                    </div>
                  </div>

                  {/* DYNAMIC SIZE SELECTION */}
                  {allUniqueSizes.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900">Available Sizes</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allUniqueSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => {
                              if (size === selectedSize) return;
                              setSelectedSize(size);
                              const newSize = size;

                              if (newSize && product.colorOptions) {
                                // 1. Try to find variation with CURRENT color and NEW size
                                let matchingIdx = -1;
                                
                                const currentOpt = product.colorOptions[selectedOptionIndex];
                                const currentOptSizes = currentOpt ? (Array.isArray(currentOpt.sizes) ? currentOpt.sizes : (currentOpt.size ? [currentOpt.size] : [])) : [];
                                
                                if (currentOptSizes.includes(newSize)) {
                                  matchingIdx = selectedOptionIndex;
                                } else {
                                  matchingIdx = product.colorOptions.findIndex(opt => {
                                    const optSizes = Array.isArray(opt.sizes) ? opt.sizes : (opt.size ? [opt.size] : []);
                                    return optSizes.includes(newSize);
                                  });
                                }

                                // 3. Select the found variation
                                if (matchingIdx !== -1) {
                                  const matchingOpt = product.colorOptions[matchingIdx];
                                  const optColors = Array.isArray(matchingOpt.colors) ? matchingOpt.colors : (matchingOpt.color ? [matchingOpt.color] : []);
                                  setSelectedOptionIndex(matchingIdx);
                                  setSelectedImage(1);
                                  setSearchParams({ v: matchingOpt.name || optColors[0] || matchingOpt.sku, idx: matchingIdx }, { replace: true });
                                }
                              }
                            }}
                            className={`px-6 py-2.5 text-[11px] font-semibold tracking-widest border transition-all uppercase ${
                              (selectedSize === size)
                                ? 'border-black bg-white text-black shadow-sm'
                                : 'border-gray-200 text-gray-400 hover:border-gray-900 hover:text-black'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              );
            })()}

            {/* Quantity Calculator */}
            <div className="mb-8 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Quantity</h3>
                <button onClick={() => setCalculatorOpen(!calculatorOpen)} className="text-sm font-medium text-blue-600 underline hover:text-blue-800 transition-colors">How much do I need?</button>
              </div>

              {/* Calculator Modal/Dropdown */}
              {calculatorOpen && (
                <div className="bg-[#f8f9fa] p-6 rounded-lg mb-6 relative">
                  <button onClick={() => setCalculatorOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><HiX className="text-xl" /></button>
                  <h4 className="text-base font-semibold text-gray-900 mb-6">Calculate how many tiles I need:</h4>

                  <div className="flex w-fit border border-gray-300 rounded-md overflow-hidden mb-6 bg-white">
                    <button onClick={() => setCalcUnit('Feet')} className={`px-6 py-1.5 text-sm font-semibold transition-colors ${calcUnit === 'Feet' ? 'bg-[#002855] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Feet</button>
                    <button onClick={() => setCalcUnit('Inches')} className={`px-6 py-1.5 text-sm font-semibold transition-colors ${calcUnit === 'Inches' ? 'bg-[#002855] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Inches</button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700">Length</label>
                      <div className="bg-white border border-gray-200 p-2 text-center w-full sm:w-32 rounded flex flex-col">
                        <input type="number" value={calcLength} onChange={e => setCalcLength(e.target.value)} className="w-full text-center font-semibold text-gray-800 outline-none text-lg" placeholder="0" />
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{calcUnit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700">Width</label>
                      <div className="bg-white border border-gray-200 p-2 text-center w-full sm:w-32 rounded flex flex-col">
                        <input type="number" value={calcWidth} onChange={e => setCalcWidth(e.target.value)} className="w-full text-center font-semibold text-gray-800 outline-none text-lg" placeholder="0" />
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{calcUnit}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleCalculate} className="bg-black text-white text-sm font-bold tracking-widest uppercase px-8 py-3 hover:bg-gray-800 transition-colors mb-4">
                    Calculate
                  </button>

                  {calcMessage && (
                    <div className="text-sm font-medium text-[#10b981] mt-2 mb-4 leading-relaxed">
                      {calcMessage}
                    </div>
                  )}
                </div>
              )}

              {/* Direct Inputs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <input type="number" value={inputSqft} onChange={e => handleSqftChange(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 font-semibold outline-none focus:border-blue-500 transition-colors text-[12px]" placeholder="Enter square footage" />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-[12px]">sq. ft.</span>
                </div>
                <div className="flex-1 relative">
                  <input type="number" value={inputBoxes} onChange={e => handleBoxesChange(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 font-semibold outline-none focus:border-blue-500 transition-colors text-[12px]" 
                    placeholder={`Or enter ${pricingUnit} amount`} />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-medium text-[12px]">
                    {pricingUnit}{parseInt(inputBoxes, 10) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Add Extra for Cuts & Waste</span>
                <div className="flex bg-gray-50 border border-gray-200 p-0.5 rounded w-full max-w-xs">
                  {[0, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleWastageChange(pct)}
                      className={`flex-1 text-center py-1.5 text-[10px] font-bold transition-all rounded uppercase cursor-pointer ${
                        wastagePercentage === pct
                          ? 'bg-[#002642] text-white shadow-sm'
                          : 'text-gray-500 hover:text-black hover:bg-gray-100'
                      }`}
                    >
                      {pct === 0 ? "0%" : pct === 15 ? "15% (Rec.)" : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Total Price Module */}
              {((selectedOption && (selectedOption.price || selectedOption.pricePerSqft)) || (product.price || product.pricePerSqft)) > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-end mb-6">
                  <h3 className="text-[16px] font-medium text-gray-900 mb-2 sm:mb-0">Total Price</h3>
                  <div className="text-right">
                    <div className="text-[18px] font-bold text-gray-900">
                      ₹{inputBoxes ? (((parseInt(inputBoxes, 10)) * ((selectedOption && selectedOption.price) ? selectedOption.price : (product.price || ((product.sqftPerBox || 5.38) * (product.pricePerSqft || 0)) || 53.8))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) : '0.00'}
                    </div>
                    {inputBoxes && (
                        <div className="text-xs font-medium text-gray-500 mt-1">
                           {inputBoxes} {pricingUnit}{parseInt(inputBoxes, 10) !== 1 ? 's' : ''} covers {(parseInt(inputBoxes, 10) * ((selectedOption && selectedOption.sqftPerBox) ? selectedOption.sqftPerBox : (product.sqftPerBox || 5.38))).toFixed(2)} Sq.Ft. {wastagePercentage > 0 && `(includes ${wastagePercentage}% extra)`}
                        </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!inputBoxes}
                  className={`flex-1 ${!inputBoxes ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#2a2a2a] hover:bg-black text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'} font-bold text-sm tracking-wider uppercase py-4 rounded transition-all`}
                >
                  Add To Cart
                </button>
                <button className="w-14 shrink-0 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors">
                  <HiOutlineHeart className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10 text-gray-600 leading-relaxed text-xs md:text-[13px] border-y border-gray-100 py-6">
              {selectedOption?.description || product.description || "No description provided for this product."}
            </div>

            {/* Product Specifications */}
            {(
              (product.effects?.length > 0) || (product.formats?.length > 0) || (product.colors?.length > 0) ||
              (product.tileUses?.length > 0) || (product.styles?.length > 0) || (product.materials?.length > 0) ||
              (product.looks?.length > 0) || (product.finishes?.length > 0)
            ) && (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/60">
                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-gray-900">Product Specifications</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: "Effect", values: product.effects },
                      { label: "Format", values: product.formats },
                      { label: "Color", values: product.colors },
                      { label: "Tile Use", values: product.tileUses },
                      { label: "Style", values: product.styles },
                      { label: "Material", values: product.materials },
                      { label: "Look", values: product.looks },
                      { label: "Finish", values: product.finishes },
                    ].map(({ label, values }) =>
                      values && values.length > 0 ? (
                        <div key={label} className="flex items-start gap-4">
                          <span className="w-20 shrink-0 text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] pt-1">{label}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {values.map(v => (
                              <span key={v} className="px-2.5 py-1 text-[10px] font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-full uppercase tracking-wider hover:bg-gray-200 transition-colors">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                    {product.piecesPerBox && (
                      <div className="flex items-start gap-4 pt-3 border-t border-gray-50 mt-2">
                        <span className="w-20 shrink-0 text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] pt-1">Pack</span>
                        <span className="text-[11px] font-bold text-gray-600">{product.piecesPerBox} pieces / {pricingUnit}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

          </div>

        </div>
      </div>

      <RelatedProducts category={product.category} currentProductId={product._id} />
    </div>
  );
}