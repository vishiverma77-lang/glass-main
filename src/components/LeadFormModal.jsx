import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

const LeadFormModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    tileType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000); // 1 second delay for better UX on reload

    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Lead Form Submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-none"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />

            <button
              onClick={closeModal}
              className="absolute p-2 transition-colors right-4 top-4 text-slate-400 hover:text-blue-600"
            >
              <IoCloseOutline size={28} />
            </button>

            <div className="p-8 md:p-10">
              {!submitted ? (
                <>
                  <div className="mb-8 text-center">
                    <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
                      Premium Tile Selection
                    </h2>
                    <p className="text-slate-500">
                      Transform your space with our expert guidance. Fill the form to get a personalized quote.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block mb-1 text-sm font-semibold text-[#1a1a1a]">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-sm font-semibold text-[#1a1a1a]">Phone Number</label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your number"
                          className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-semibold text-[#1a1a1a]">Type of Tiles</label>
                        <select
                          required
                          name="tileType"
                          value={formData.tileType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        >
                          <option value="">Select Category</option>
                          <option value="floor">Floor Tiles</option>
                          <option value="wall">Wall Tiles</option>
                          <option value="bathroom">Bathroom Tiles</option>
                          <option value="kitchen">Kitchen Tiles</option>
                          <option value="outdoor">Outdoor Tiles</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-semibold text-[#1a1a1a]">Share your Idea</label>
                      <textarea
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="What are you looking for?"
                        className="w-full px-4 py-3 transition-all border outline-none resize-none bg-slate-50 border-slate-200 rounded-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      ></textarea>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 mt-2 font-bold text-white transition-all shadow-lg rounded-none bg-[#1a1a1a] hover:bg-blue-600"
                    >
                      Request Free Consultation
                    </motion.button>
                  </form>
                </>
              ) : (
                <div className="py-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full"
                  >
                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">Request Received!</h2>
                  <p className="text-slate-500">
                    Bhai, hamari team aapse bahut jald contact karegi.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadFormModal;
