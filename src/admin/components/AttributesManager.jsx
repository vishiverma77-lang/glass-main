import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiPlus, HiTrash, HiRefresh } from "react-icons/hi";
import TileLoader from "../../components/TileLoader";

const ATTRIBUTE_KEYS = [
  { key: "colors", label: "Colours" },
  { key: "shapes", label: "Shapes" },
  { key: "mosaici", label: "Mosaici" },
  { key: "effects", label: "Effect" },
  { key: "formats", label: "Format" },
  { key: "tileUses", label: "Tile Use" },
  { key: "styles", label: "Style" },
  { key: "materials", label: "Material" },
  { key: "looks", label: "Look" },
  { key: "finishes", label: "Finish" }
];

export default function AttributesManager() {
  const [attributes, setAttributes] = useState({});
  const [selectedAttr, setSelectedAttr] = useState("colors");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchAttributes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/attributes`);
      setAttributes(res.data);
    } catch (err) {
      console.error("Error fetching attributes:", err);
      setError("Failed to fetch attributes from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleAddValue = async (e) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    setActionLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/attributes/${selectedAttr}/add`,
        { value: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setAttributes((prev) => ({
        ...prev,
        [selectedAttr]: res.data.values
      }));
      setSuccessMsg(`"${newValue}" added successfully!`);
      setNewValue("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error adding value:", err);
      setError(err.response?.data?.message || "Failed to add value.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteValue = async (valueToDelete) => {
    if (!window.confirm(`Are you sure you want to delete "${valueToDelete}"?`)) return;

    setActionLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/attributes/${selectedAttr}/delete`,
        { value: valueToDelete },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setAttributes((prev) => ({
        ...prev,
        [selectedAttr]: res.data.values
      }));
      setSuccessMsg(`"${valueToDelete}" deleted successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error deleting value:", err);
      setError(err.response?.data?.message || "Failed to delete value.");
    } finally {
      setActionLoading(false);
    }
  };

  const currentValues = attributes[selectedAttr] || [];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Product Attributes Manager</h3>
          <p className="text-slate-500 font-medium mt-1">Add, update, or remove options for your product tag dropdowns and choices.</p>
        </div>
        <button
          onClick={fetchAttributes}
          disabled={loading || actionLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all uppercase tracking-wider disabled:opacity-50"
        >
          <HiRefresh className={`text-sm ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Main Layout Grid */}
      {loading ? (
        <div className="py-20">
          <TileLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Panel - Attribute Selector */}
          <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">Select Attribute</span>
            {ATTRIBUTE_KEYS.map((attr) => (
              <button
                key={attr.key}
                onClick={() => {
                  setSelectedAttr(attr.key);
                  setError("");
                  setSuccessMsg("");
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center ${
                  selectedAttr === attr.key
                    ? "bg-slate-900 text-white font-extrabold shadow-md shadow-slate-900/15"
                    : "text-slate-600 hover:bg-slate-200/60 font-semibold"
                }`}
              >
                <span className="text-xs uppercase tracking-wide">{attr.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedAttr === attr.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {attributes[attr.key]?.length || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Right Panel - Value Manager */}
          <div className="md:col-span-8 space-y-6">
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl font-bold text-xs">
                ⚠️ {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-5 py-3 rounded-xl font-bold text-xs animate-pulse">
                ✓ {successMsg}
              </div>
            )}

            {/* Add Value Form */}
            <form onSubmit={handleAddValue} className="flex gap-3 items-end bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Add New Value to {ATTRIBUTE_KEYS.find(a => a.key === selectedAttr)?.label}
                </label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  disabled={actionLoading}
                  placeholder={`e.g. New ${ATTRIBUTE_KEYS.find(a => a.key === selectedAttr)?.label.slice(0, -1)}`}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800 text-sm shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading || !newValue.trim()}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
              >
                <HiPlus className="text-sm" /> Add
              </button>
            </form>

            {/* Values Grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Current Values ({currentValues.length})
              </label>

              {currentValues.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold text-xs">No values added yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {currentValues.map((val) => (
                    <div
                      key={val}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between group transition-all"
                    >
                      <span className="text-xs font-bold text-slate-700 truncate mr-2" title={val}>
                        {val}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteValue(val)}
                        disabled={actionLoading}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-white transition-colors"
                        title="Delete option"
                      >
                        <HiTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
