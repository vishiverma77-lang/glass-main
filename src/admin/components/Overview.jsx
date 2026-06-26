import React, { useState, useEffect } from "react";
import EditProduct from "./EditProduct";
import TileLoader from "../../components/TileLoader";
import { getImageUrl } from "../../utils/imageUtils";

const ProductCard = React.memo(({ product, onEdit, onDelete }) => {
  return (
    <div className="border border-slate-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-all group bg-white flex flex-col h-full translate-z-0">
      <div className="aspect-square bg-slate-100 rounded-md mb-2 overflow-hidden relative">
        {product.series && (
          <div className="absolute top-1 left-1 bg-slate-900/75 backdrop-blur-[2px] text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider z-10 max-w-[90%] truncate" title={product.series}>
            {product.series}
          </div>
        )}
        {product.images && product.images.length > 0 ? (
          <img 
            src={getImageUrl(product.images[0])} 
            alt={product.name} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-[8px]">No Image</div>
        )}
      </div>
      <h4 className="font-bold text-slate-800 text-[11px] line-clamp-1 leading-tight mb-0.5 uppercase tracking-tighter" title={product.name}>{product.name}</h4>
      <div className="flex items-center justify-between mt-1 mb-2">
        <p className="text-blue-600 font-bold text-[10px] leading-none">₹{product.price || 0} / {(product.pricingUnit || "box").toLowerCase()}</p>
        {product.series && (
          <span className="text-[7px] font-black bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-blue-100 line-clamp-1 max-w-[50px] text-right" title={product.series}>
            {product.series}
          </span>
        )}
      </div>
      
      <div className="mt-auto pt-2 flex items-center gap-1 border-t border-slate-100">
        <button 
          onClick={() => onEdit(product)}
          className="flex-1 bg-white border border-slate-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white active:scale-95 text-slate-500 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-tighter cursor-pointer"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(product._id)}
          className="flex-1 bg-white border border-slate-200 hover:bg-red-600 hover:border-red-600 hover:text-white active:scale-95 text-slate-500 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-tighter cursor-pointer"
        >
          Del
        </button>
      </div>
    </div>
  );
});

const Overview = ({ setActiveTab }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products?admin=true`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = React.useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          setProducts(prev => prev.filter(p => p._id !== id));
        } else {
          alert("Failed to delete product");
        }
      } catch (err) {
        alert("Error connecting to server");
      }
    }
  }, []);
  
  const handleEditSuccess = React.useCallback(() => {
      setEditingProduct(null);
      fetchProducts(); 
  }, []);

  const handleEdit = React.useCallback((product) => {
    setEditingProduct(product);
  }, []);

  if (editingProduct) {
      return (
          <EditProduct 
             product={editingProduct} 
             onCancel={() => setEditingProduct(null)} 
             onSuccess={handleEditSuccess} 
          />
      );
  }

  return (
    <div className="space-y-8 antialiased">
      <div className="grid md:grid-cols-2 gap-6">
        <div
          onClick={() => setActiveTab("Collections")}
          className="p-6 bg-blue-600 text-white rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow active:scale-[0.99] duration-300"
        >
          <h2 className="text-xl font-bold">Manage Collections</h2>
          <p className="text-sm opacity-90">View and update series</p>
        </div>

        <div
          onClick={() => setActiveTab("Orders")}
          className="p-6 bg-slate-800 text-white rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow active:scale-[0.99] duration-300"
        >
          <h2 className="text-xl font-bold">Orders</h2>
          <p className="text-sm opacity-90">Manage orders</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
         <div className="border-b border-slate-100 pb-6 mb-6">
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">Uploaded Products</h3>
             <p className="text-slate-500 font-medium mt-1">View, edit, or delete the products showing on your website.</p>
         </div>

         {isLoading ? (
             <TileLoader />
         ) : error ? (
             <div className="p-10 text-center text-red-500 font-bold">{error}</div>
         ) : products.length === 0 ? (
             <div className="text-center py-20 text-slate-400 font-semibold">
                No products found. Start by adding a new one!
             </div>
         ) : (
             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
               {products.map(product => (
                 <ProductCard 
                    key={product._id} 
                    product={product} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                 />
               ))}
             </div>
         )}
      </div>
    </div>
  );
};

export default Overview;