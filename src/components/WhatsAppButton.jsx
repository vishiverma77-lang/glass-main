import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 3 seconds to get the user's attention politely
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("wa-tooltip-dismissed");
      if (!dismissed) {
        setShowTooltip(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    sessionStorage.setItem("wa-tooltip-dismissed", "true");
  };

  // WhatsApp click-to-chat URL with country code 91 (India) and pre-filled message
  const whatsappUrl = "https://wa.me/919716119547?text=Hello%21%20I%20visited%20your%20website%20and%20would%20like%20to%20inquire%20about%20your%20products.";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Tooltip Chat Bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white text-slate-800 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100 max-w-[280px] flex flex-col gap-2"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Close tooltip"
            >
              <IoClose size={16} />
            </button>

            {/* Bubble content */}
            <div className="pr-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                Direct Inquiries
              </p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Need premium design assistance? Let's connect on WhatsApp!
              </p>
            </div>

            {/* Direct Button in Tooltip */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-xs font-bold py-1.5 px-3.5 rounded-lg hover:bg-[#20ba56] transition-colors self-start mt-1 shadow-sm"
              onClick={() => setShowTooltip(false)}
            >
              <FaWhatsapp size={14} />
              Start Chat
            </a>

            {/* Speech bubble tail */}
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_6px_24px_rgba(37,211,102,0.4)] hover:bg-[#20ba56] transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing outer ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping -z-10" />

        <FaWhatsapp size={32} className="relative z-10" />
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
