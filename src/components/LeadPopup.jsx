import React, { useState, useEffect } from "react";
import { HiX, HiCheckCircle } from "react-icons/hi";

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    address: "",
    purpose: "" 
  });

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenLeadPopup");
    
    if (!hasSeenPopup) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenLeadPopup", "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Details:", formData);
    // You can add axios.post to save user details here
    
    // Show success message
    setIsSubmitted(true);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      closePopup();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-none p-6 md:p-8 relative shadow-[10px_10px_0px_0px_rgba(31,41,55,1)] border-2 border-gray-900 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto scrollbar-none">
        
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-1"
        >
          <HiX className="text-2xl" />
        </button>

        {isSubmitted ? (
          /* Success Message State */
          <div className="text-center py-8">
            <HiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-wide">
              Details Submitted!
            </h2>
            <p className="text-gray-600 font-medium">
              Hamari team aapse bahut jald contact karegi.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Thank you for choosing Ceragreslux!
            </p>
          </div>
        ) : (
          /* Form State */
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-wide">
                WELCOME TO <span className="text-blue-600">CeragresluxS</span>
              </h2>
              <p className="text-gray-500 text-sm">
                Please provide your details below to get best recommendations and personalized offers!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-900 rounded-none focus:outline-none focus:ring-0 focus:bg-white transition-all text-sm font-bold"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-900 rounded-none focus:outline-none focus:ring-0 focus:bg-white transition-all text-sm font-bold"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Email Address <span className="text-gray-400 lowercase normal-case font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-900 rounded-none focus:outline-none focus:ring-0 focus:bg-white transition-all text-sm font-bold"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Complete Address
                </label>
                <textarea
                  required
                  rows="2"
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-900 rounded-none focus:outline-none focus:ring-0 focus:bg-white transition-all resize-none text-sm font-bold"
                  placeholder="Enter your detailed address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Tiles Requirement / Description
                </label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-900 rounded-none focus:outline-none focus:ring-0 focus:bg-white transition-all resize-none text-sm font-bold"
                  placeholder="E.g., Bathroom tiles needed for 300 sq.ft, matte finish..."
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-none transition-colors uppercase tracking-widest text-sm mt-4"
              >
                Submit Details
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
