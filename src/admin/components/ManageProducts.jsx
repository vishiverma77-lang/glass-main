import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/imageUtils";

const ManageProducts = ({ onEditProduct, onAddNewProduct }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      const token = localStorage.getItem("adminToken");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          setProducts(products.filter(p => p._id !== id));
          alert("Product deleted successfully");
        } else {
          alert("Failed to delete product");
        }
      } catch (err) {
        alert("Error connecting to server");
      }
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-slate-500">Loading products...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 relative">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800">Manage Products</h3>
          <p className="text-slate-500 font-medium mt-2">View, edit or delete your uploaded premium pieces.</p>
        </div>
        <button 
          onClick={onAddNewProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
        >
          + Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-semibold">
          No products found. Start by adding a new one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id} className="border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all group bg-white">
              <div className="aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                {product.series && (
                  <div className="absolute top-2 left-2 bg-slate-900/75 backdrop-blur-[2px] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider z-10 max-w-[90%] truncate" title={product.series}>
                    {product.series}
                  </div>
                )}
                {product.images && product.images.length > 0 ? (
                  <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
              </div>
              <h4 className="font-bold text-slate-800 text-lg line-clamp-1">{product.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <p className="text-blue-600 font-bold">₹{product.price} <span className="text-slate-400 text-xs normal-case font-medium">/ {(product.pricingUnit || "box").toLowerCase()}</span></p>
                {product.series && (
                  <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                    {product.series}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => onEditProduct(product)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
