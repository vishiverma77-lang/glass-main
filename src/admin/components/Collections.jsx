import React from "react";
import { COLLECTIONS } from "../constants";

const Collections = ({ onSelectCollection }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 relative">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Collection Management</h3>
        <p className="text-slate-500 font-medium mt-2 italic">Select a series to manage its specific product portfolio.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {COLLECTIONS.map((name) => (
          <button
            key={name}
            onClick={() => onSelectCollection(name)}
            className="group relative px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center transition-all duration-300 hover:bg-blue-600 hover:border-blue-600 hover:shadow-md hover:shadow-blue-600/20 hover:-translate-y-0.5"
          >
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-white transition-colors">
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Collections;
