import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../utils/imageUtils';

const ThreeSixtyViewer = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Preload images for smooth rotation
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    setImagesLoaded(0);
    images.forEach((src) => {
      const img = new Image();
      img.src = getImageUrl(src);
      img.onload = () => setImagesLoaded(prev => prev + 1);
      img.onerror = () => { console.error("Failed to load image:", img.src); setImagesLoaded(prev => prev + 1); }; // Ensure loading completes even on error
    });
  }, [images]);

  const handleMouseMove = (e) => {
    if (images.length === 0) return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

      if (images.length > 1) {
        let newIndex = Math.floor((x / rect.width) * images.length);
        if (newIndex >= images.length) newIndex = images.length - 1;
        setCurrentIndex(newIndex);
      } else {
        // Full 3D trackball rotation for a single image
        // X mouse movement -> Y axis rotation
        // Y mouse movement -> X axis rotation
        const rotateY = ((x / rect.width) - 0.5) * 360; // -180 to 180 degrees
        const rotateX = ((y / rect.height) - 0.5) * -360; // 180 to -180 degrees
        
        setTilt({ x: rotateX, y: rotateY });
      }
    }
  };

  const handleMouseLeave = () => {
    if (images.length === 1) {
      setTilt({ x: 0, y: 0 });
    }
  };

  const handleTouchMove = (e) => {
    if (images.length === 0) return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.touches[0].clientY - rect.top, rect.height));

      if (images.length > 1) {
        let newIndex = Math.floor((x / rect.width) * images.length);
        if (newIndex >= images.length) newIndex = images.length - 1;
        setCurrentIndex(newIndex);
      } else {
        const rotateY = ((x / rect.width) - 0.5) * 360;
        const rotateX = ((y / rect.height) - 0.5) * -360;
        setTilt({ x: rotateX, y: rotateY });
      }
    }
  };

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const imageUrl = getImageUrl(currentImage);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full cursor-grab active:cursor-grabbing aspect-square bg-slate-50 select-none overflow-hidden rounded-2xl group`}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      {/* Loading Overlay */}
      {imagesLoaded < images.length && (
        <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Scanning Details ({Math.round((imagesLoaded / images.length) * 100)}%)
          </p>
        </div>
      )}

      {/* Main Container */}
      {images.length > 1 ? (
        <img 
          src={imageUrl} 
          alt={`Product view ${currentIndex}`}
          className="w-full h-full object-contain pointer-events-none transition-opacity duration-300"
          style={{ opacity: imagesLoaded > 0 ? 1 : 0 }}
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center p-6 pointer-events-none transition-transform duration-75 ease-linear"
          style={{ 
             transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
             transformStyle: 'preserve-3d'
          }}
        >
          <img 
            src={imageUrl} 
            alt="Product view"
            className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
            style={{ 
              opacity: imagesLoaded > 0 ? 1 : 0,
              transform: `translateZ(20px)`,
              filter: `drop-shadow(0px 20px 30px rgba(0,0,0,0.25))`
            }}
          />
        </div>
      )}

      {/* Navigation UI */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap text-center"> 
          {images.length > 1 ? "Hover horizontally to rotate 360°" : "Hover to rotate in 3D"} 
        </span>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-100" style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}></div>
    </div>
  );
};

export default React.memo(ThreeSixtyViewer);
