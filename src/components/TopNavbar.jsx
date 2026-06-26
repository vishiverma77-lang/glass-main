import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiMenu,
  HiX,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const announcements = [
  " FREE SAMPLES AND FREE SHIPPING FOR PROFESSINALS ",
  " EASY 365 DAYS RETURN ",
  "SAFE PALLET PACKAGING ",
];

const navLinks = [

  {
    name: "Shop By Effects",
    link: "#",
    dropdown: ["Concrete", "Stone", "Wood", "Marble", "Metal", "Contemporary", "Precious Metal", "Artisan", "Carpet"]
  },
  {
    name: "Shop By Formats",
    link: "#",
    dropdown: ["Small", "Medium", "Large", "Slabs", "Planks", "Stripes", "Chevron", "Hexagon"]
  },
  {
    name: "Shop By Colours",
    link: "#",
    dropdown: ["Azul", "Beige", "Black", "Blue", "Bronze", "Brown", "Dark Grey", "Grey", "Metallic Brown", "White"]
  },
  {
    name: "Shop By Collections",
    link: "#",
    dropdown: ["Absolute", "Alpi", "Always", "Alchimia", "Arizona", "B&W", "Brooklyn", "Brush", "Calabria", "Cerdisa", "Chalet", "Channel", "Chester", "Chelsea", "Cimone", "Cromatica", "Core", "Corten", "Denver", "Esprit", "Etruria", "Externa", "Fidenza", "Fresco", "Gatsby", "Heritage", "Imperia", "Kemberg", "Laverton", "Linea Oro", "Linea Plata", "Mashup", "Motion", "Noon", "Oregon", "Oxford", "Page", "Palmaria", "Policroma", "Poudre", "Privilige", "Rift", "Seattle", "Serpal", "Spazzio", "Specchio Oro", "Spruzza Oro", "Stream", "Walks", "Weekend"]
  },
  { name: "Shop Samples", link: "/Shop By Sample" },

];

function TopNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { cartCount, openCart, wishlistCount, openWishlist } = useCart();
  const { user, admin, logout, userLogout, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Collapse mobile dropdowns when drawer is closed
  useEffect(() => {
    if (!isMenuOpen) {
      setExpandedDropdown(null);
    }
  }, [isMenuOpen]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false); // Close mobile search if open
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Scroll hide/show announcement bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        setShowAnnouncement(false);
      } else {
        setShowAnnouncement(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const prevAnnouncement = () =>
    setAnnouncementIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  const nextAnnouncement = () =>
    setAnnouncementIndex((prev) => (prev + 1) % announcements.length);

  const currentUser = user;
  const currentLogout = userLogout;

  return (
    <header className="w-full font-sans fixed top-0 left-0 z-[1000]">
      {/* === ANNOUNCEMENT BAR === */}
      <div
        className="announcement-bar"
        style={{
          maxHeight: showAnnouncement ? "40px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          background: "#1b3a4b",
        }}
      >
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 relative">
          <button
            onClick={prevAnnouncement}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <HiChevronLeft className="text-lg" />
          </button>
          <span
            key={announcementIndex}
            className="text-white text-xs font-semibold tracking-widest uppercase text-center announcement-text"
          >
            {announcements[announcementIndex]}
          </span>
          <button
            onClick={nextAnnouncement}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <HiChevronRight className="text-lg" />
          </button>
        </div>
      </div>

      {/* === MAIN HEADER === */}
      <div 
        className="bg-white border-b border-gray-200 shadow-sm overflow-hidden transition-all duration-300"
        style={{
          maxHeight: showAnnouncement ? "80px" : "0px",
          opacity: showAnnouncement ? 1 : 0,
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between h-[60px] gap-6">

          {/* Logo */}
          <Link to="/" className="shrink-0 no-underline flex items-center ml-4">
            <img src="/logo.jpg" alt="CÉRÀGRÈS LUXE" className="h-[20px] lg:h-[20px] w-auto object-contain " />
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-[320px] xl:max-w-[420px] relative">
            <input
              type="text"
              placeholder="Search "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-[36px] pl-3 pr-10 py-2.5 border border-gray-300 rounded-none text-sm outline-none bg-gray-50 focus:bg-white focus:border-gray-500 transition-all"
            />
            <HiOutlineSearch 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={handleSearch}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {/* Conditional Order Button */}
            {isUser && (
              <Link 
                to="/orders" 
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-all no-underline"
              >
                Order
              </Link>
            )}

            <div className="relative">
              {currentUser ? (
                <div
                  className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 text-sm transition-colors cursor-pointer py-2"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="w-8 h-8 rounded-none bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {(currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold">{currentUser.email?.split('@')[0] || 'User'}</span>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute top-full right-0 mt-0 bg-white border border-gray-200 shadow-xl w-48 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 mb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{currentUser.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 no-underline">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { currentLogout(); setProfileOpen(false); navigate('/'); }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 text-sm transition-colors no-underline">
                  <HiOutlineUser className="text-xl" />
                </Link>
              )}
            </div>

            <button 
              onClick={openWishlist}
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 text-sm transition-colors relative"
            >
              <HiOutlineHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 text-red-600 text-[10px] font-bold leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 no-underline relative transition-colors"
            >
              <div className="relative">
                <HiOutlineShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-blue-600 text-[10px] font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
          {/* Mobile Search + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-700 text-2xl"
            >
              <HiOutlineSearch />
            </button>
            <button 
              onClick={openCart}
              className="relative text-gray-700 text-2xl no-underline"
            >
              <HiOutlineShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1 rounded-none leading-tight min-w-[16px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="text-gray-700 text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="lg:hidden px-4 pb-3 pt-1 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-none text-sm outline-none bg-gray-50 focus:bg-white focus:border-gray-500"
                autoFocus
              />
              <HiOutlineSearch 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" 
                onClick={handleSearch}
              />
            </div>
          </div>
        )}
      </div>

      {/* === CATEGORY NAV BAR === */}
      <div className={`absolute top-full left-0 w-full hidden lg:block z-40 transition-all duration-300 ${!showAnnouncement ? 'bg-white  ' : 'bg-transparent'}`}>
       <div className="max-w-[1600px] mx-auto px-4 lg:px-6 flex items-center justify-between h-[80px] lg:h-[90px] relative whitespace-nowrap gap-4 lg:gap-6">
          <Link to="/" className="shrink-0 no-underline flex items-center justify-center ml-3">
           <img
  src="/Ceragreslogo.jpeg"
  alt="Ceragres Logo"
  className="w-[60px] h-[60px] lg:w-[77px] lg:h-[77px] object-contain relative left-2.5 "
/>
          </Link>
          <ul className={`flex items-stretch justify-start gap-2 lg:gap-3 xl:gap-4 list-none m-0 p-0 px-4 lg:px-6 whitespace-nowrap h-full ${showAnnouncement ? 'flex-1' : 'flex-none'}`}>
            {navLinks.map((item, i) => (
              <li key={i} className={`shrink-0 group ${item.name === "Shop By Collections" ? "" : "relative"}`}>
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center px-1.5 lg:px-2 h-full text-xs lg:text-sm xl:text-base 2xl:text-lg leading-[1.2em] font-normal capitalize tracking-wide no-underline transition-all duration-150 whitespace-nowrap border-b-2 ${
                      showAnnouncement
                        ? item.dropdown
                          ? "text-white border-transparent group-hover:text-white group-hover:border-transparent"
                          : item.link !== "#" && isActive
                            ? "text-white border-white"
                            : "text-white border-transparent group-hover:text-white group-hover:border-white"
                        : item.dropdown
                          ? "text-[#444444] border-transparent group-hover:text-[#444444] group-hover:border-transparent"
                          : item.link !== "#" && isActive
                            ? "text-[#444444] border-[#444444]"
                            : "text-[#444444] border-transparent group-hover:text-[#444444] group-hover:border-[#444444]"
                    }`
                  }
                  style={{ fontFamily: 'Arial Regular, sans-serif', cursor: item.link === "#" ? 'default' : 'pointer' }}
                  end={item.link === "/"}
                  onClick={(e) => {
                    if (item.link === "#") e.preventDefault();
                  }}
                >
                  {item.name}
                </NavLink>
                {item.dropdown && (
                  <div
                    className={`absolute top-full left-1/2 ${
                      item.name === "Shop By Collections"
                        ? "w-[90vw] max-w-[1100px] p-6 lg:p-12 lg:pb-[65px]"
                        : "min-w-[230px] py-6"
                    } hidden group-hover:block bg-[#00264b] shadow-2xl z-[60]`}
                    style={{ transform: 'translateX(-50%)' }}
                  >
                    {item.name === "Shop By Collections" && (
                      <h3 className="text-white text-[18px] font-bold mb-6 text-left tracking-wide max-w-[950px] mx-auto pl-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                        All Collections
                      </h3>
                    )}
                    {item.name === "Shop By Collections" ? (
                      <div className="flex justify-between max-w-[950px] mx-auto">
                        {[0, 1, 2, 3, 4].map((colIdx) => {
                          const colItems = item.dropdown.slice(colIdx * 10, (colIdx + 1) * 10);
                          return (
                            <div key={colIdx} className="flex flex-col items-start gap-y-1">
                              {colItems.map((sub, idx) => (
                                <Link
                                  key={idx}
                                  to={`/collection/${sub.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-')}`}
                                  className="block text-left px-4 py-1 text-[14px] font-normal text-white hover:bg-[#0a3a66] hover:text-white no-underline whitespace-nowrap rounded-md transition-colors"
                                  style={{ fontFamily: 'Arial, sans-serif' }}
                                >
                                  {sub}
                                </Link>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <ul
                        className="list-none m-0 p-0 max-h-[65vh] overflow-y-auto custom-scrollbar w-max mx-auto"
                      >
                        {item.dropdown.map((sub, idx) => (
                          <li key={idx}>
                            <Link
                              to={
                                item.name === "Shop By Effects" ? `/effect/${sub.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-')}` :
                                item.name === "Shop By Formats" ? `/format/${sub.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-')}` :
                                item.name === "Shop By Colours" ? `/colour/${sub.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-')}` :
                                item.link
                              }
                              className="block text-left px-4 py-2.5 text-[14px] font-normal text-white hover:bg-[#0a3a66] hover:text-white no-underline whitespace-nowrap rounded-md transition-colors"
                              style={{ fontFamily: 'Arial, sans-serif' }}
                            >
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Shifting elements in Category Bar (only visible when scrolled) */}
          {!showAnnouncement && (
            <div className="flex items-center gap-3 lg:gap-5 shrink-0 ml-auto animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Compact Search Bar */}
              <div className="relative w-[120px] lg:w-[160px] xl:w-[220px]">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-3 pr-8 py-1.5 border border-gray-200 rounded-none text-sm outline-none bg-gray-50 focus:bg-white focus:border-gray-400 transition-all"
                />
                <HiOutlineSearch 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-base cursor-pointer hover:text-blue-600 transition-colors" 
                  onClick={handleSearch}
                />
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2 lg:gap-4 pt-2">
                <div className="relative">
                  {currentUser ? (
                    <div
                      className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 cursor-pointer py-1"
                      onMouseEnter={() => setProfileOpen(true)}
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      <div className="w-7 h-7 bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                        {(currentUser.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      {profileOpen && (
                        <div className="absolute top-full right-0 mt-0 bg-white border border-gray-200 shadow-xl w-48 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100 mb-2">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{currentUser.email}</p>
                          </div>
                          {isAdmin && (
                            <Link to="/admin" className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 no-underline">
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => { currentLogout(); setProfileOpen(false); navigate('/'); }}
                            className="w-full text-left px-4 py-2 text-xs text-red-600 font-black uppercase tracking-widest hover:bg-red-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors no-underline">
                      <HiOutlineUser className="text-xl" />
                    </Link>
                  )}
                </div>

                <button 
                  onClick={openWishlist}
                  className="flex items-center text-gray-700 hover:text-gray-900 relative transition-colors"
                >
                  <HiOutlineHeart className="text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-red-600 text-[10px] font-bold leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={openCart}
                  className="flex items-center text-gray-700 hover:text-gray-900 relative transition-colors"
                >
                  <HiOutlineShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-blue-600 text-[10px] font-bold leading-none">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === MOBILE DRAWER === */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[1500]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[2000] shadow-2xl transition-transform duration-300 overflow-y-auto custom-scrollbar ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center px-2 py-4 border-b border-gray-100">
          <Link to="/" className="shrink-0 no-underline flex items-center" onClick={() => setIsMenuOpen(false)}>
            <img src="/logo.jpg" alt="CÉRÀGRÈS LUXE" className="h-[35px] w-auto object-contain left-6 " />
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="text-2xl text-gray-600">
            <HiX />
          </button>
        </div>
        <ul className="list-none m-0 p-0">
          {navLinks.map((item, i) => {
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isExpanded = expandedDropdown === i;

            return (
              <li key={i} className="border-b border-gray-100">
                {hasDropdown ? (
                  <>
                    <button
                      onClick={() => setExpandedDropdown(isExpanded ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-gray-800 font-semibold text-sm hover:text-blue-600 hover:bg-blue-50 transition-colors text-left border-none bg-transparent cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <HiChevronRight
                        className={`text-lg text-gray-500 transition-transform duration-300 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="bg-gray-50 border-t border-b border-gray-100 py-2">
                        {item.name === "Shop By Collections" ? (
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-6 py-2">
                            {item.dropdown.map((sub, idx) => (
                              <Link
                                key={idx}
                                to={`/collection/${sub.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-')}`}
                                className="block py-2 text-xs text-gray-600 hover:text-blue-600 no-underline truncate"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col px-6">
                            {item.dropdown.map((sub, idx) => (
                              <Link
                                key={idx}
                                to={
                                  item.name === "Shop By Effects" ? `/effect/${sub.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-')}` :
                                  item.name === "Shop By Formats" ? `/format/${sub.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-')}` :
                                  item.name === "Shop By Colours" ? `/colour/${sub.toLowerCase().replace(/&/g, 'and').replace(/ /g, '-')}` :
                                  "#"
                                }
                                className="block py-2 text-xs text-gray-600 hover:text-blue-600 no-underline"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.link}
                    className="block px-6 py-4 text-gray-800 font-semibold text-sm no-underline hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
          {currentUser ? (
            <>
              <li className="border-b border-gray-100">
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{currentUser.email}</p>
                </div>
              </li>
              {isAdmin && (
                <li className="border-b border-gray-100">
                  <Link
                    to="/admin"
                    className="block px-6 py-4 text-blue-600 font-black text-sm no-underline hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
              {isUser && (
                <li className="border-b border-gray-100">
                  <Link
                    to="/orders"
                    className="block px-6 py-4 text-blue-600 font-black text-sm no-underline hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </li>
              )}
              <li className="border-b border-gray-100">
                <button
                  onClick={() => { currentLogout(); setIsMenuOpen(false); navigate('/'); }}
                  className="w-full text-left px-6 py-4 text-red-600 font-black text-sm no-underline hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li className="border-b border-gray-100">
              <Link
                to="/login"
                className="block px-6 py-4 text-gray-800 font-semibold text-sm no-underline hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Register
              </Link>
            </li>
          )}
        </ul>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .announcement-text {
          animation: fadeSlide 0.4s ease;
        }
      `}</style>
    </header>
  );
}

export default TopNavbar;