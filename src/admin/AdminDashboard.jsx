import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Overview from "./components/Overview";
import Orders from "./components/Orders";
import Collections from "./components/Collections";
import CollectionProducts from "./components/CollectionProducts";
import Inquiries from "./components/Inquiries";
import SliderManager from "./components/SliderManager";
import { HiHome, HiLogout } from "react-icons/hi";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [inquiriesCount, setInquiriesCount] = useState(0);

  const tabs = ["Overview", "Orders", "Collections", "Inquiries", "Slider"];
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders`);
        const pendingOrders = res.data.filter(order => order.status === "Pending");
        setPendingOrdersCount(pendingOrders.length);
      } catch (error) {
        console.error("Error fetching order count:", error);
      }
    };
    fetchOrdersCount();
  }, []);

  useEffect(() => {
    const updateInquiriesCount = () => {
      const stored = JSON.parse(localStorage.getItem("contact_inquiries") || "[]");
      setInquiriesCount(stored.length);
    };
    updateInquiriesCount();
    window.addEventListener("storage", updateInquiriesCount);
    // Custom event to update count in same window when submitted/deleted
    window.addEventListener("contact-inquiry-updated", updateInquiriesCount);
    return () => {
      window.removeEventListener("storage", updateInquiriesCount);
      window.removeEventListener("contact-inquiry-updated", updateInquiriesCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/admin/login";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview setActiveTab={setActiveTab} />;
      case "Orders":
        return <Orders />;
      case "Users":
        return <Users />;
      case "Collections":
        if (selectedCollection) {
          return (
            <CollectionProducts
              collectionName={selectedCollection}
              onBack={() => setSelectedCollection(null)}
            />
          );
        }
        return <Collections onSelectCollection={setSelectedCollection} />;
      case "Inquiries":
        return <Inquiries />;
      case "Slider":
        return <SliderManager />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">

      {/* 🔥 Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          ADMIN
        </div>

        <div className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition ${activeTab === tab
                  ? "bg-blue-600 shadow-lg shadow-blue-500/20"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
            >
              <span className="font-bold text-sm tracking-wide">{tab}</span>
              {tab === "Orders" && pendingOrdersCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-slate-900 animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
              {tab === "Inquiries" && inquiriesCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full ring-2 ring-slate-900">
                  {inquiriesCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sidebar bottom - links */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => window.location.href = "/"}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all font-bold text-sm"
          >
            <HiHome className="text-xl" /> Visit Shop
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-100 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
          >
            <HiLogout className="text-xl" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 🔥 Main Content */}
      <div className="flex-1 flex flex-col pt-0">

        {/* 🔥 Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{activeTab}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Control Center</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
            >
              <HiHome className="text-lg" /> Visit Shop
            </button>
          </div>
        </header>

        {/* 🔥 Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;