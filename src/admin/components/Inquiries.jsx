import React, { useState, useEffect } from "react";
import { HiTrash, HiOutlineMail, HiOutlinePhone, HiCalendar } from "react-icons/hi";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load inquiries from localStorage
    const loadInquiries = () => {
      const stored = JSON.parse(localStorage.getItem("contact_inquiries") || "[]");
      // Sort by newest first
      stored.sort((a, b) => new Date(b.date) - new Date(a.date));
      setInquiries(stored);
    };

    loadInquiries();
    
    // Add event listener to capture changes if they happen in another tab/window
    window.addEventListener("storage", loadInquiries);
    return () => window.removeEventListener("storage", loadInquiries);
  }, []);

  const handleDelete = (indexToDelete) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      const updated = inquiries.filter((_, idx) => idx !== indexToDelete);
      setInquiries(updated);
      localStorage.setItem("contact_inquiries", JSON.stringify(updated));
      window.dispatchEvent(new Event("contact-inquiry-updated"));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all inquiries?")) {
      setInquiries([]);
      localStorage.removeItem("contact_inquiries");
      window.dispatchEvent(new Event("contact-inquiry-updated"));
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const term = searchTerm.toLowerCase();
    return (
      inq.name.toLowerCase().includes(term) ||
      inq.email.toLowerCase().includes(term) ||
      inq.subject.toLowerCase().includes(term) ||
      (inq.phone && inq.phone.includes(term))
    );
  });

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleDateString("en-IN", options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Customer Inquiries ({filteredInquiries.length})
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">
            Manage inquiries submitted via Contact Form
          </p>
        </div>

        {inquiries.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-all self-start sm:self-center"
          >
            Clear All Inquiries
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
        />
      </div>

      {/* Inquiries Table */}
      {filteredInquiries.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
          <p className="text-slate-400 text-sm font-semibold">
            {searchTerm ? "No inquiries match your search." : "No inquiries found."}
          </p>
          {!searchTerm && (
            <p className="text-slate-400 text-xs mt-1">
              Submissions from the frontend contact form will appear here.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Customer Info</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-4">Message</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inq, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <HiCalendar className="text-slate-400" />
                      {formatDate(inq.date)}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="font-extrabold text-sm text-slate-800">{inq.name}</div>
                    <div className="flex flex-col gap-0.5 mt-1 text-xs text-slate-500">
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <HiOutlineMail className="shrink-0" />
                        {inq.email}
                      </a>
                      <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <HiOutlinePhone className="shrink-0" />
                        {inq.phone}
                      </a>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-sm font-bold text-slate-700 max-w-[180px] truncate">
                    {inq.subject}
                  </td>
                  <td className="py-5 px-4 text-sm text-slate-600 max-w-[300px] break-words whitespace-pre-line leading-relaxed">
                    {inq.message}
                  </td>
                  <td className="py-5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                      title="Delete Inquiry"
                    >
                      <HiTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
