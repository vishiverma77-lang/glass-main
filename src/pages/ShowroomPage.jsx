import React from "react";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock, HiOutlineCalendar, HiOutlineArrowRight } from "react-icons/hi";

const showrooms = [
  {
    city: "New Delhi",
    name: "Ceragreslux Flagship Experience Center",
    address: "A-15, Rajouri Garden, Ring Road, New Delhi - 110027",
    phone: "+91 98765 43210",
    email: "delhi@ceragreslux.com",
    hours: "10:00 AM - 8:00 PM (All Days)",
    img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1470&auto=format&fit=crop",
    mapLink: "#",
    features: ["Virtual Reality Tour", "Design Expert On-Site", "Valet Parking"]
  },
  {
    city: "Mumbai",
    name: "Ceragreslux Design Studio",
    address: "Unit 4, Ground Floor, Kamala Mills Compound, Lower Parel, Mumbai - 400013",
    phone: "+91 98765 43211",
    email: "mumbai@ceragreslux.com",
    hours: "10:30 AM - 7:30 PM (Closed on Tuesdays)",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b1e94cfd5?q=80&w=1400&auto=format&fit=crop",
    mapLink: "#",
    features: ["Custom Fabrication", "Exclusive Trade Lounge", "Coffee Bar"]
  },
  {
    city: "Bengaluru",
    name: "Ceragreslux Selection Center",
    address: "100 Feet Road, Indiranagar, Bengaluru - 560038",
    phone: "+91 98765 43212",
    email: "blr@ceragreslux.com",
    hours: "10:00 AM - 8:00 PM (All Days)",
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1470&auto=format&fit=crop",
    mapLink: "#",
    features: ["Outdoor Tile Garden", "Kids Play Area", "Sample Pickup"]
  },
];

export default function ShowroomPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* ─── HERO ─────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] text-white py-32 px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Tile Showroom"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            Experience Centers
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            See. Touch. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Experience.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Step into a world of design inspiration. Explore our vast collections, feel the premium textures, and let our expert designers guide you to the perfect tiles for your space.
          </p>
        </div>
      </section>

      {/* ─── SHOWROOM LOCATIONS ───────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Find A Showroom Near You</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We're expanding rapidly. Visit our flagship locations to experience the best of Ceragreslux.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {showrooms.map((store) => (
            <div key={store.city} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-gray-100 group flex flex-col">
              
              {/* Image Container with Zoom Effect */}
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={store.img}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    {store.city}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-orange-600 transition-colors">{store.name}</h3>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-start gap-4 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-orange-600">
                      <HiOutlineLocationMarker className="text-lg" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed pt-1">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-orange-600">
                      <HiOutlineClock className="text-lg" />
                    </div>
                    <p className="text-sm font-medium">{store.hours}</p>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-orange-600">
                      <HiOutlinePhone className="text-lg" />
                    </div>
                    <p className="text-sm font-medium">{store.phone}</p>
                  </div>
                </div>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {store.features.map((feature, i) => (
                    <span key={i} className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <a
                    href={store.mapLink}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-colors text-sm"
                  >
                    Directions
                  </a>
                  <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-900 font-bold py-3.5 rounded-xl hover:border-gray-900 transition-colors text-sm">
                    <HiOutlineCalendar className="text-lg" />
                    Book Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VIRTUAL TOUR BANNER (PREMIUM) ──────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-orange-600">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Can't Make It To A Showroom?</h2>
          <p className="text-orange-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
            Book a free 1-on-1 virtual design consultation. Walk through our collections via video call and get personalized recommendations from the comfort of your home.
          </p>
          <button className="bg-white text-orange-600 font-black text-lg px-10 py-5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto group">
            Book Virtual Consultation
            <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
