import React from 'react';

export default function TileLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full py-20 col-span-full">
      <style>
        {`
          @keyframes custom-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-custom-spin {
            animation: custom-spin 3s linear infinite;
          }
        `}
      </style>
      <div className="grid grid-cols-2 gap-1.5 relative w-16 h-16 animate-custom-spin">
        <div className="w-7 h-7 bg-slate-900 rounded-sm animate-pulse"></div>
        <div className="w-7 h-7 bg-slate-400 rounded-sm animate-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-7 h-7 bg-slate-600 rounded-sm animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="w-7 h-7 bg-slate-700 rounded-sm animate-pulse" style={{ animationDelay: '450ms' }}></div>
      </div>
      <p className="text-[11px] font-black tracking-[0.3em] text-slate-800 uppercase animate-pulse">
        Loading 
      </p>
    </div>
  );
}
