import React, { useState, useEffect } from "react";
import { HiTrash, HiPlus } from "react-icons/hi";
import { getImageUrl } from "../../utils/imageUtils";

const SliderManager = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [btnText, setBtnText] = useState("");
  const [link, setLink] = useState("");
  const [order, setOrder] = useState(0);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/slides`);
      if (!response.ok) throw new Error("Failed to fetch slides");
      const data = await response.json();
      setSlides(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select a slide image.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("subtitle", subtitle);
    formData.append("title", title);
    formData.append("btnText", btnText);
    formData.append("link", link);
    formData.append("order", order);

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/slides`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload slide");

      // Reset form
      setImageFile(null);
      setImagePreview("");
      setSubtitle("");
      setTitle("");
      setBtnText("");
      setLink("");
      setOrder(0);

      alert("Slide uploaded successfully!");
      fetchSlides();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      const token = localStorage.getItem("adminToken");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/slides/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Failed to delete slide");

        alert("Slide deleted successfully!");
        fetchSlides();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Upload Slide Form */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Upload New Slide</h3>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">Create a new slide with specification overlays and button redirects</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Image Upload */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Slide Image (Required)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative min-h-[220px]">
              {imagePreview ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-[180px] object-contain rounded-lg shadow-sm mb-4" />
                  <button 
                    type="button" 
                    onClick={() => { setImageFile(null); setImagePreview(""); }} 
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-all"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-slate-500">
                    <HiPlus size={24} />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">Select slide image</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">PNG, JPG, JPEG, WEBP</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Right Column - Slide Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Subtitle (Line 1 - Small Text)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Starts with Samples"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Title (Line 2 - Large Text)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Everything here"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Button Text</label>
              <input
                type="text"
                value={btnText}
                onChange={(e) => setBtnText(e.target.value)}
                placeholder="e.g. Shop Samples"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Button Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /Shop By Sample"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600 transition-all"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Order (Sorting)</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="e.g. 0"
                className="w-full max-w-[200px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600 transition-all"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-[#002642] hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer shadow-md"
              >
                {submitting ? "Uploading Slide..." : "Upload Slide"}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* Active Slides List */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Active Slides ({slides.length})</h3>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">Manage currently active slides appearing on the homepage</p>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-bold">Loading slides...</div>
        ) : slides.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-slate-400 text-sm font-semibold">No slides found in database.</p>
            <p className="text-slate-400 text-xs mt-1">Website is currently falling back to static default slides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((slide) => (
              <div key={slide._id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow bg-slate-50/20">
                <div className="relative aspect-[16/7] w-full bg-slate-100 overflow-hidden">
                  <img src={getImageUrl(slide.image)} alt={slide.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="w-9 h-9 rounded-full bg-white text-slate-400 hover:text-red-600 shadow-sm flex items-center justify-center hover:scale-105 transition-all cursor-pointer border border-slate-100"
                      title="Delete Slide"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Line 1 (Subtitle)</span>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug">{slide.subtitle || <span className="text-slate-300 italic">None</span>}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Order</span>
                        <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">{slide.order}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Line 2 (Title)</span>
                      <h4 className="text-base font-black text-slate-900 leading-snug">{slide.title || <span className="text-slate-300 italic">None</span>}</h4>
                    </div>
                  </div>

                  <div className="border-t border-slate-100/80 pt-4 mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Button:</span>
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">{slide.btnText || "None"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 max-w-[50%] truncate">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Link:</span>
                      <span className="text-slate-700 font-bold truncate text-[11px]" title={slide.link}>{slide.link || "None"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SliderManager;
