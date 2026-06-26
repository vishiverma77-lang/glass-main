import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiArrowRight } from "react-icons/hi";

const Footer = ({ onContactClick }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#DBDBDB] text-slate-800 mt-8 font-sans">

      

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand Column */}
        <div className="lg:col-span-2 flex items-center gap-5">
          <img 
            src="/Ceragreslogo.jpeg" 
            alt="Ceragres Luxe Logo" 
            className="w-15 h-15 md:w-15 md:h-15 object-contain shrink-0" 
          />
          <div className="text-[#002642] font-semibold text-[10px] md:text-[10px] leading-snug">
            <p className="m-0">Ceragres Ceramics Private Limited</p>
            <p className="m-0">7th & 8th Floor, Mascots, Times Square Building,</p>
            <p className="m-0">Western Expressway Highway, Andheri (EAST),</p>
            <p className="m-0">Mumbai, Maharashtra (INDIA)- 400069</p>
            <p className="m-0 mt-1 font-bold">touch [ at ] ceragresceramics [ dot ] com</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-5 pb-2 border-b border-black/10">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              ["SHOP BY EFFECTS", "/#"],
              ["SHOP BY FORMATS", "/#"],
              ["SHOP BY COLOURS", "/#"],
              ["SHOP BY COLLECTIONS", "/#"],
              ["SHOP BY SAMPLES", "/#"],
              ["CONTACT US", "#"],
            ].map(([label, href]) => (
              <li key={label}>
                {label === "CONTACT US" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (onContactClick) onContactClick();
                    }}
                    className="text-slate-600 text-sm hover:text-blue-600 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200 group cursor-pointer border-none bg-transparent p-0 text-left outline-none uppercase"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                      <HiArrowRight className="text-blue-600 text-xs" />
                    </span>
                    {label}
                  </button>
                ) : (
                  <a
                    href={href}
                    className="text-slate-600 text-sm hover:text-blue-600 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                      <HiArrowRight className="text-blue-600 text-xs" />
                    </span>
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-5 pb-2 border-b border-black/10">
            Categories
          </h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              ["Brand", "/"],
              ["Company", "/"],
              ["Collections", "/"],
              ["Merchandising", "/"],
              ["Download", "/"],
              ["Warranty", "/"],
              ["Samples", "/"],
              ["International Presence", "/"],
              ["Technology", "/"],
              ["BIM", "/"],
              ["Professional", "/"],
             
            ].map(([label, href]) => (
              <li key={label}>
                {label === "Contact Us" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (onContactClick) onContactClick();
                    }}
                    className="text-slate-600 text-sm hover:text-blue-600 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200 group cursor-pointer border-none bg-transparent p-0 text-left outline-none"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                      <HiArrowRight className="text-blue-600 text-xs" />
                    </span>
                    {label}
                  </button>
                ) : (
                  <a
                    href={href}
                    className="text-slate-600 text-sm hover:text-blue-600 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                      <HiArrowRight className="text-blue-600 text-xs" />
                    </span>
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>


      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600 text-center">
            © 2025 Ceragreslux. All Rights Reserved. Crafted with ❤️ in India.
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;