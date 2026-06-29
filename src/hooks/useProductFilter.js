import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";

const cleanPrice = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

export function useProductFilter(products) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const handleGlobalChange = (e) => {
      if (e.target && e.target.tagName === "SELECT") {
        const options = Array.from(e.target.options).map(o => o.text || o.value);
        if (options.includes("Recommended") && options.includes("Price: Low to High")) {
          const value = e.target.value;
          const newParams = new URLSearchParams(window.location.search);
          newParams.set("sort", value);
          setSearchParams(newParams);
        }
      }
    };

    document.addEventListener("change", handleGlobalChange);

    // Sync any existing sort selects on the page with current query param
    const currentSort = searchParams.get("sort") || "Recommended";
    const selects = document.querySelectorAll("select");
    for (const select of selects) {
      const options = Array.from(select.options).map(o => o.text || o.value);
      if (options.includes("Recommended") && options.includes("Price: Low to High")) {
        if (select.value !== currentSort) {
          select.value = currentSort;
        }
      }
    }

    return () => {
      document.removeEventListener("change", handleGlobalChange);
    };
  }, [searchParams, setSearchParams]);

  if (!products || products.length === 0) return [];

  // Step 1: Pre-calculate series-wide information (merged sizes and variations)
  const seriesMap = {};
  products.forEach(p => {
    if (p.series) {
      const sKey = p.series.toLowerCase().trim();
      if (!seriesMap[sKey]) {
        seriesMap[sKey] = {
          allSizes: new Set(),
          allColorOptions: [],
          allVariationColors: []
        };
      }
      
      // Merge parent sizes
      if (p.sizes) p.sizes.forEach(s => seriesMap[sKey].allSizes.add(s));
      
      // Merge variation sizes and options
      if (p.colorOptions) {
        p.colorOptions.forEach(opt => {
          seriesMap[sKey].allColorOptions.push({ ...opt, parentId: p._id || p.id });
          if (opt.sizes) opt.sizes.forEach(s => seriesMap[sKey].allSizes.add(s));
          if (opt.size) seriesMap[sKey].allSizes.add(opt.size);
        });
      }

      // Merge variation color swatches
      if (p.variationColors) {
        p.variationColors.forEach(vc => {
          if (!seriesMap[sKey].allVariationColors.find(v => v.name === vc.name)) {
            seriesMap[sKey].allVariationColors.push(vc);
          }
        });
      }
    }
  });

  // Step 2: Filter parents first
  const filteredParents = products.filter(p => {
    const filters = ["Colour", "Tile Use", "Style", "Materials", "Size", "Look", "Shape", "Finish", "Mosaici", "Collections", "Effect", "Format"];
    
    for (const f of filters) {
      // Gather selected filter values supporting various casings of the parameter key (e.g. Mosaici, mosaici)
      const selected = [
        ...searchParams.getAll(f),
        ...searchParams.getAll(f.toLowerCase()),
        ...searchParams.getAll(f.charAt(0).toUpperCase() + f.slice(1).toLowerCase())
      ].filter(Boolean);

      if (selected.length === 0) continue;
      
      let pValues = [];
      if (f === "Colour") pValues = Array.isArray(p.colors) ? p.colors : (p.color ? [p.color] : (p.colours ? p.colours : (p.colour ? [p.colour] : [])));
      if (f === "Tile Use" && p.tileUses) pValues = p.tileUses;
      if (f === "Style" && p.styles) pValues = p.styles;
      if (f === "Materials" && p.materials) pValues = p.materials;
      if (f === "Size") {
        pValues = Array.from(new Set([
          ...(p.sizes || []),
          ...(p.colorOptions?.flatMap(opt => [...(opt.sizes || []), ...(opt.size ? [opt.size] : [])]) || [])
        ])).filter(Boolean);
      }
      if (f === "Look" && p.looks) pValues = p.looks;
      if (f === "Shape") {
        pValues = Array.from(new Set([
          ...(p.shapes || []),
          ...(p.shape ? [p.shape] : []),
          ...(p.colorOptions?.flatMap(opt => [...(opt.shapes || []), ...(opt.shape ? [opt.shape] : [])]) || [])
        ])).filter(Boolean);
      }
      if (f === "Finish") {
        pValues = Array.from(new Set([
          ...(p.finishes || []),
          ...(p.colorOptions?.flatMap(opt => opt.finishes || []) || [])
        ])).filter(Boolean);
      }
      if (f === "Effect") {
        pValues = Array.from(new Set([
          ...(p.effects || []),
          ...(p.colorOptions?.flatMap(opt => opt.effects || []) || [])
        ])).filter(Boolean);
      }
      if (f === "Format") {
        pValues = Array.from(new Set([
          ...(p.formats || []),
          ...(p.colorOptions?.flatMap(opt => opt.formats || []) || [])
        ])).filter(Boolean);
      }
      if (f === "Mosaici" && p.mosaici) pValues = p.mosaici;
      if (f === "Collections" && p.series) pValues = [p.series];

      if (!pValues || !Array.isArray(pValues) || pValues.length === 0) return false;
      
      // Perform a robust, trimmed, case-insensitive substring comparison
      const hasMatch = pValues.some(val => 
        val && selected.some(sel => {
          const s = sel.trim().toLowerCase();
          const v = val.trim().toLowerCase();
          return s.includes(v) || v.includes(s);
        })
      );
      
      if (!hasMatch) return false;
    }
    return true;
  });

  // Step 3: Format filtered parents with merged series data (without flattening variations into separate products)
  const flattened = [];
  filteredParents.forEach(p => {
    const sKey = p.series?.toLowerCase().trim();
    const seriesData = sKey ? seriesMap[sKey] : null;

    const sizes = seriesData ? Array.from(seriesData.allSizes) : (p.sizes || []);
    const colorOptions = p.colorOptions || [];
    const variationColors = p.variationColors || [];

    const defaultOpt = colorOptions && colorOptions[0];
    const image = getImageUrl(p.images?.[0] || defaultOpt?.images?.[0] || defaultOpt?.thumbnail);
    const price = p.price || defaultOpt?.price;
    const pricingUnit = p.pricingUnit || defaultOpt?.pricingUnit;
    const sku = p.sku || defaultOpt?.sku;

    flattened.push({
      ...p,
      id: p._id || p.id,
      uniqueKey: p._id || p.id,
      title: p.name,
      image,
      price,
      pricingUnit,
      sku,
      sizes,
      colorOptions,
      variationColors
    });
  });

  // Step 4: Apply sorting based on "sort" query parameter
  const sortBy = searchParams.get("sort") || "Recommended";
  let sorted = [...flattened];

  if (sortBy === "Price: Low to High") {
    sorted.sort((a, b) => cleanPrice(a.price) - cleanPrice(b.price));
  } else if (sortBy === "Price: High to Low") {
    sorted.sort((a, b) => cleanPrice(b.price) - cleanPrice(a.price));
  } else if (sortBy === "Top Rated") {
    sorted.sort((a, b) => {
      const ratingA = parseFloat(a.rating) || 0;
      const ratingB = parseFloat(b.rating) || 0;
      return ratingB - ratingA;
    });
  } else if (sortBy === "New Arrivals" || sortBy === "Newest First" || sortBy === "Newest Arrivals") {
    sorted.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (dateA && dateB) return dateB - dateA;
      if (a._id && b._id) return String(b._id).localeCompare(String(a._id));
      return 0;
    });
  }

  return sorted;
}
