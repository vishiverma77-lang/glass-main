import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";

const ContactFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      console.log("Contact Form Submitted:", formData);
      
      // Store in localStorage for retrieval / mock database
      const existingInquiries = JSON.parse(localStorage.getItem("contact_inquiries") || "[]");
      existingInquiries.push({ ...formData, date: new Date().toISOString() });
      localStorage.setItem("contact_inquiries", JSON.stringify(existingInquiries));
      
      // Dispatch custom event to notify other components (e.g. admin dashboard sidebar badge)
      window.dispatchEvent(new Event("contact-inquiry-updated"));
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Auto close modal after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-xl overflow-hidden bg-white shadow-2xl rounded-none border border-slate-100 z-10"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-600 to-indigo-700" />

            <button
              onClick={onClose}
              className="absolute p-2 transition-colors right-4 top-4 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100"
              aria-label="Close modal"
            >
              <IoCloseOutline size={26} />
            </button>

            <div className="p-8 md:p-10">
              {!submitted ? (
                <>
                  <div className="mb-6">
                    <h2 className="mb-2 text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                      Contact Our Team
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base">
                      Have questions about our collections? Drop us a message, and our design consultants will get back to you shortly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block mb-1 text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 text-sm transition-all border outline-none bg-slate-50 border-slate-200 focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 text-sm transition-all border outline-none bg-slate-50 border-slate-200 focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          className="w-full px-4 py-3 text-sm transition-all border outline-none bg-slate-50 border-slate-200 focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                      <input
                        required
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this inquiry about?"
                        className="w-full px-4 py-3 text-sm transition-all border outline-none bg-slate-50 border-slate-200 focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                      <textarea
                        required
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write details of your query..."
                        className="w-full px-4 py-3 text-sm transition-all border outline-none resize-none bg-slate-50 border-slate-200 focus:border-blue-600 focus:bg-white"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 mt-2 font-black text-white text-xs uppercase tracking-widest transition-all bg-[#002642] hover:bg-blue-600 disabled:bg-slate-400 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaPaperPlane size={12} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-emerald-100 text-emerald-600 rounded-full"
                  >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h2 className="mb-3 text-2xl font-black text-slate-900 uppercase tracking-tight">Thank You!</h2>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Your inquiry has been successfully submitted. Our team will review your details and contact you shortly.
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

export default ContactFormModal;
