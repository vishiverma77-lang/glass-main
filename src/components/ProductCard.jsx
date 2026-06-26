import React, { useState } from 'react';
import { HiOutlineHeart, HiHeart, HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUtils';

export default function ProductCard({ id, image, images, likes, colors, brand, title, price, rating, reviews, piecesPerBox, sizes, colorOptions, sku, pricingUnit, variationName, variationIndex, selectedVariation, variationColors }) {
  const { addToCart, openCart, toggleWishlist, isInWishlist } = useCart();

  // Find the initial active variation index based on the product name/title or colors
  const defaultOptionIndex = React.useMemo(() => {
    if (variationIndex !== undefined && colorOptions && colorOptions[variationIndex]) {
      return variationIndex;
    }

    if ((!variationColors || variationColors.length <= 1) && (!colorOptions || colorOptions.length <= 1)) {
      return 0;
    }

    const titleLower = (title || "").toLowerCase();

    const matchesColor = (colorVal) => {
      if (!colorVal) return false;
      const val = colorVal.toLowerCase();
      
      if (titleLower.includes(val)) return true;
      
      const synonyms = {
        tierra: ['tierra', 'beige', 'sand', 'taupe', 'brown', 'earth'],
        beige: ['tierra', 'beige', 'sand', 'taupe', 'brown', 'earth'],
        brown: ['tierra', 'beige', 'sand', 'taupe', 'brown', 'earth'],
        azul: ['azul', 'blue', 'bleu'],
        blue: ['azul', 'blue', 'bleu'],
        blanco: ['blanco', 'white', 'blanc'],
        white: ['blanco', 'white', 'blanc'],
        grey: ['grey', 'gray', 'gris'],
        gray: ['grey', 'gray', 'gris'],
        black: ['black', 'negro', 'noir'],
        negro: ['black', 'negro', 'noir']
      };

      if (synonyms[val]) {
        return synonyms[val].some(syn => titleLower.includes(syn));
      }
      
      return val.split(/[\s-]+/).some(word => word && titleLower.includes(word));
    };

    if (variationColors && variationColors.length > 0) {
      const idx = variationColors.findIndex(colorObj => matchesColor(colorObj.name));
      if (idx !== -1) return idx;
    }

    if (colorOptions && colorOptions.length > 0) {
      const idx = colorOptions.findIndex(opt => matchesColor(opt.name || opt.color));
      if (idx !== -1) return idx;
    }

    if (colors && colors.length > 0) {
      if (variationColors && variationColors.length > 0) {
        const idx = variationColors.findIndex(colorObj => {
          const colorName = colorObj.name?.toLowerCase();
          return colorName && colors.some(c => {
            const lc = c.toLowerCase();
            return lc.includes(colorName) || colorName.includes(lc) || matchesColor(colorName);
          });
        });
        if (idx !== -1) return idx;
      }
    }

    return 0;
  }, [title, variationColors, colorOptions, colors, variationIndex]);

  const [activeOptionIndex, setActiveOptionIndex] = useState(defaultOptionIndex);

  // Sync state if defaultOptionIndex changes
  React.useEffect(() => {
    setActiveOptionIndex(defaultOptionIndex);
  }, [defaultOptionIndex]);

  const allUniqueSizes = Array.from(new Set([
    ...(sizes || []),
    ...(colorOptions?.flatMap(opt => [...(opt.sizes || []), ...(opt.size ? [opt.size] : [])]) || [])
  ])).filter(Boolean);

  // Determine the active variation/option matching the hovered swatch
  const activeColorObj = variationColors && variationColors[activeOptionIndex] ? variationColors[activeOptionIndex] : null;
  const activeOption = (activeOptionIndex === defaultOptionIndex)
    ? (colorOptions && colorOptions[activeOptionIndex] ? colorOptions[activeOptionIndex] : null)
    : (variationColors && variationColors.length > 0
        ? (colorOptions?.find(opt => {
            const optColors = Array.isArray(opt.colors) ? opt.colors : (opt.color ? [opt.color] : []);
            return optColors.some(c => c?.toLowerCase() === activeColorObj?.name?.toLowerCase());
          }) || (colorOptions && colorOptions[activeOptionIndex]) || null)
        : (colorOptions && colorOptions[activeOptionIndex] ? colorOptions[activeOptionIndex] : null));

  const displayImage = activeOption && activeOption.images && activeOption.images.length > 0
    ? getImageUrl(activeOption.images[0])
    : (activeOption?.thumbnail ? getImageUrl(activeOption.thumbnail) : image);

  const displaySecondImageUrl = activeOption && activeOption.images && activeOption.images.length > 1
    ? getImageUrl(activeOption.images[1])
    : (images && images.length > 1 ? getImageUrl(images[1]) : null);

  const hasSecondImage = !!displaySecondImageUrl;

  const activeVariationName = activeOption?.name || activeOption?.color || (activeColorObj?.name);
  const activeVariationIndex = colorOptions && activeOption ? colorOptions.indexOf(activeOption) : activeOptionIndex;

  const detailUrl = `/product/${id}${
    activeVariationName 
      ? `?v=${encodeURIComponent(activeVariationName)}&idx=${activeVariationIndex}` 
      : (variationName ? `?v=${encodeURIComponent(variationName)}${variationIndex !== undefined ? `&idx=${variationIndex}` : ''}` : '')
  }`;

  const displayPrice = activeOption && activeOption.price ? activeOption.price : price;
  const displayPricingUnit = activeOption && activeOption.pricingUnit ? activeOption.pricingUnit : pricingUnit;

  return (
    <div 
      className="border border-gray-200 bg-white group cursor-pointer hover:shadow-2xl transition-all duration-300 flex flex-col h-full rounded-none"
      onMouseLeave={() => setActiveOptionIndex(defaultOptionIndex)}
    >
      {/* Link wrapping the image and content to go to details page */}
      <Link to={detailUrl} className="flex flex-col h-full"> 
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 p-1 rounded-none">
          <img 
            src={displayImage} 
            alt={title} 
            className={`w-full h-full object-cover rounded-none transition-opacity duration-500 ease-in-out ${
              hasSecondImage ? "group-hover:opacity-0" : ""
            }`}
          />
          {hasSecondImage && (
            <img 
              src={displaySecondImageUrl} 
              alt={`${title} - Alternate View`} 
              className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            />
          )}
          {/* Wishlist Heart Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({ _id: id, name: title, images: [displayImage], colors });
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md transition-all z-20 hover:scale-110 ${
              isInWishlist(id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            {isInWishlist(id) ? <HiHeart className="text-lg" /> : <HiOutlineHeart className="text-lg" />}
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col flex-1 h-full">
          {/* Colors & Add Sample */}
          <div className="flex justify-between items-center mb-4 min-h-[32px]">
            <div className="flex items-center gap-2 flex-wrap">
              {variationColors && variationColors.length > 0 ? (
                variationColors.slice(0, 4).map((colorObj, idx) => (
                  <div 
                    key={idx} 
                    className={`w-6 h-6 rounded-full border shadow-sm overflow-hidden cursor-pointer hover:scale-110 transition-all ${
                      activeOptionIndex === idx ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-200'
                    }`}
                    title={colorObj.name}
                    onMouseEnter={() => setActiveOptionIndex(idx)}
                  >
                    <img 
                      src={getImageUrl(colorObj.image)} 
                      alt={colorObj.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/logo.jpg"; }}
                    />
                  </div>
                ))
              ) : (
                colorOptions && colorOptions.slice(0, 4).map((option, idx) => (
                  <div 
                    key={idx} 
                    className={`w-6 h-6 rounded-full border shadow-sm overflow-hidden cursor-pointer hover:scale-110 transition-all ${
                      activeOptionIndex === idx ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-200'
                    }`}
                    title={option.color || option.name}
                    onMouseEnter={() => setActiveOptionIndex(idx)}
                  >
                    <img 
                      src={getImageUrl(option.thumbnail || option.images?.[0])} 
                      alt={option.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/logo.jpg"; }}
                    />
                  </div>
                ))
              )}
              {(variationColors?.length > 4 || (!variationColors?.length && colorOptions?.length > 4)) && (
                <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-[10px] text-gray-600 bg-white cursor-pointer hover:bg-gray-50 shadow-sm">
                  +
                </div>
              )}
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault(); // prevent triggering the link navigation
                const activeColor = activeOption?.color || (activeOption?.colors?.[0]) || (activeColorObj?.name) || selectedVariation?.color;
                addToCart({
                  _id: id,
                  name: title,
                  images: [displayImage],
                  colors: colors,
                  price: 0,
                  isSample: true
                }, 1, null, activeColor, true);
                openCart();
              }}
              className="bg-[#e4e2d9] text-gray-900 tracking-wider text-[9px] font-bold px-4 py-2 uppercase hover:bg-[#d6d3c8] transition-colors rounded-none whitespace-nowrap z-10 relative">
              + Add Sample
            </button>
          </div>

          {/* Text Details */}
          <div className="mb-4 flex-1">
            <h4 className="text-[11px] font-black tracking-widest text-[#2a2a2a] uppercase mb-1.5">{title}</h4>

          </div>

          {/* Footer (Price & Rating) */}
          <div className="mt-auto flex justify-between items-end pb-1 border-t border-gray-100 pt-3">
            {(!displayPrice || Number(displayPrice) === 0) ? (
              <div></div>
            ) : (
              <p className="text-gray-400 font-black text-sm tracking-tighter italic">₹{displayPrice.toLocaleString()} <span className="text-[10px] font-bold uppercase tracking-widest not-italic">/ {(displayPricingUnit || "box").toLowerCase()}</span></p>
            )}
            <div></div>
          </div>
        </div>
      </Link>
    </div>
  );
}
