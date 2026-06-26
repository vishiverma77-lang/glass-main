import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import QuickAddProduct from "./QuickAddProduct";
import { getImageUrl } from "../../utils/imageUtils";

const CollectionProducts = ({ collectionName, onBack }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const fetchCollectionProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?admin=true`);
      // Filter products by the selected collection
      const filtered = response.data.filter(p => p.series === collectionName);
      setProducts(filtered);
    } catch (err) {
      setError("Failed to fetch products for this collection.");
    } finally {
      setIsLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    fetchCollectionProducts();
  }, [fetchCollectionProducts]);

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-500">Loading {collectionName} collection...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 relative">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
          >
            ←
          </button>
          <div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{collectionName}</h3>
            <p className="text-slate-500 font-medium mt-1">Series Management • {products.length} Products Found</p>
          </div>
        </div>
      </div>

      {/* 🔥 Quick Upload Banner */}
      <div className="mb-10 group relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-slate-800 transition-all hover:shadow-blue-500/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-4">
               <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">New Addition</span>
               <div className="h-[1px] w-12 bg-slate-700"></div>
             </div>
             <h4 className="text-3xl font-black text-white mb-2 leading-tight uppercase tracking-tighter italic">Expand the {collectionName} series</h4>
             <p className="text-slate-400 font-bold text-sm max-w-lg uppercase tracking-wide opacity-80">Ready to add a new premium piece? Start the upload process for this collection now.</p>
          </div>
          
          <button 
            onClick={() => setShowQuickAdd(true)}
            className="whitespace-nowrap px-8 py-4 bg-white hover:bg-blue-500 text-slate-900 hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95 group/btn"
          >
            <span className="flex items-center gap-3">
               + Upload New Product
               <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>
      </div>

      {showQuickAdd && (
        <QuickAddProduct 
          series={collectionName} 
          onCancel={() => setShowQuickAdd(false)} 
          onSuccess={() => {
            setShowQuickAdd(false);
            fetchCollectionProducts();
          }}
        />
      )}


    </div>
  );
};

export default CollectionProducts;
