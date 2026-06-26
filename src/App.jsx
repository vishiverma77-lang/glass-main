import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import WhatsAppButton from "./components/WhatsAppButton";
import ContactFormModal from "./components/ContactFormModal";

import Slider from "./components/Slider";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import TileLoader from "./components/TileLoader";

const ShowroomPage = lazy(() => import("./pages/ShowroomPage"));
const TradePage = lazy(() => import("./pages/TradePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ShopGroupPage = lazy(() => import("./pages/ShopGroupPage"));
const ShopByConcrete = lazy(() => import("./pages/ShopByConcrete"));
const ShopByStone = lazy(() => import("./pages/ShopByStone"));
const ShopByWood = lazy(() => import("./pages/ShopByWood"));
const ShopByMarble = lazy(() => import("./pages/ShopByMarble"));
const ShopByMetal = lazy(() => import("./pages/ShopByMetal"));
const ShopByContemporary = lazy(() => import("./pages/ShopByContemporary"));
const ShopByPreciousMetal = lazy(() => import("./pages/ShopByPreciousMetal"));
const ShopByArtisan = lazy(() => import("./pages/ShopByArtisan"));
const ShopByCarpet = lazy(() => import("./pages/ShopByCarpet"));
const ShopBySmall = lazy(() => import("./pages/ShopBySmall"));
const ShopByMedium = lazy(() => import("./pages/ShopByMedium"));
const ShopByLarge = lazy(() => import("./pages/ShopByLarge"));
const ShopBySlabs = lazy(() => import("./pages/ShopBySlabs"));
const ShopByPlanks = lazy(() => import("./pages/ShopByPlanks"));
const ShopByStripes = lazy(() => import("./pages/ShopByStripes"));
const ShopByChevron = lazy(() => import("./pages/ShopByChevron"));
const ShopByHexagon = lazy(() => import("./pages/ShopByHexagon"));
const ColourPage = lazy(() => import("./pages/ColourPage"));
const ShopByAbsolute = lazy(() => import("./pages/ShopByAbsolute"));
const ShopByAlpi = lazy(() => import("./pages/ShopByAlpi"));
const ShopByAlways = lazy(() => import("./pages/ShopByAlways"));
const ShopByAlchimia = lazy(() => import("./pages/ShopByAlchimia"));
const ShopByArizona = lazy(() => import("./pages/ShopByArizona"));
const ShopByBAndW = lazy(() => import("./pages/ShopByBAndW"));
const ShopByBrooklyn = lazy(() => import("./pages/ShopByBrooklyn"));
const ShopByBrush = lazy(() => import("./pages/ShopByBrush"));
const ShopByCalabria = lazy(() => import("./pages/ShopByCalabria"));
const ShopByCerdisa = lazy(() => import("./pages/ShopByCerdisa"));
const ShopByChalet = lazy(() => import("./pages/ShopByChalet"));
const ShopByChannel = lazy(() => import("./pages/ShopByChannel"));
const ShopByChester = lazy(() => import("./pages/ShopByChester"));
const ShopByChelsea = lazy(() => import("./pages/ShopByChelsea"));
const ShopByCimone = lazy(() => import("./pages/ShopByCimone"));
const ShopByCromatica = lazy(() => import("./pages/ShopByCromatica"));
const ShopByCore = lazy(() => import("./pages/ShopByCore"));
const ShopByCorten = lazy(() => import("./pages/ShopByCorten"));
const ShopByDenver = lazy(() => import("./pages/ShopByDenver"));
const ShopByEsprit = lazy(() => import("./pages/ShopByEsprit"));
const ShopByEtruria = lazy(() => import("./pages/ShopByEtruria"));
const ShopByExterna = lazy(() => import("./pages/ShopByExterna"));
const ShopByFidenza = lazy(() => import("./pages/ShopByFidenza"));
const ShopByFresco = lazy(() => import("./pages/ShopByFresco"));
const ShopByGatsby = lazy(() => import("./pages/ShopByGatsby"));
const ShopByHeritage = lazy(() => import("./pages/ShopByHeritage"));
const ShopByImperia = lazy(() => import("./pages/ShopByImperia"));
const ShopByKemberg = lazy(() => import("./pages/ShopByKemberg"));
const ShopByLaverton = lazy(() => import("./pages/ShopByLaverton"));
const ShopByLineaOro = lazy(() => import("./pages/ShopByLineaOro"));
const ShopByLineaPlata = lazy(() => import("./pages/ShopByLineaPlata"));
const ShopByMashup = lazy(() => import("./pages/ShopByMashup"));
const ShopByMotion = lazy(() => import("./pages/ShopByMotion"));
const ShopByNoon = lazy(() => import("./pages/ShopByNoon"));
const ShopByOregon = lazy(() => import("./pages/ShopByOregon"));
const ShopByOxford = lazy(() => import("./pages/ShopByOxford"));
const ShopByPage = lazy(() => import("./pages/ShopByPage"));
const ShopByPalmaria = lazy(() => import("./pages/ShopByPalmaria"));
const ShopByPolicroma = lazy(() => import("./pages/ShopByPolicroma"));
const ShopByPoudre = lazy(() => import("./pages/ShopByPoudre"));
const ShopByPrivilige = lazy(() => import("./pages/ShopByPrivilige"));
const ShopByRift = lazy(() => import("./pages/ShopByRift"));
const ShopBySeattle = lazy(() => import("./pages/ShopBySeattle"));
const ShopBySerpal = lazy(() => import("./pages/ShopBySerpal"));
const ShopBySpazzio = lazy(() => import("./pages/ShopBySpazzio"));
const ShopBySpecchioOro = lazy(() => import("./pages/ShopBySpecchioOro"));
const ShopBySpruzzaOro = lazy(() => import("./pages/ShopBySpruzzaOro"));
const ShopByStream = lazy(() => import("./pages/ShopByStream"));
const ShopByWalks = lazy(() => import("./pages/ShopByWalks"));
const ShopByWeekend = lazy(() => import("./pages/ShopByWeekend"));
const ShopBySample = lazy(() => import("./pages/ShopBySample"));

const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const AllCollectionsPage = lazy(() => import("./pages/AllCollectionsPage"));

const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
import ProtectedRoute from "./components/ProtectedRoute";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Determine if this is a bleeding page (hero image starts at very top under transparent navbar)
  const bleedingPaths = [
    "/",
    "/showrooms",
    "/trade",
    "/effect",
    "/format",
    "/colour",
    "/collection",
    "/Shop By Sample",
    "/Shop%20By%20Sample"
  ];
  const isBleeding = location.pathname === "/" || bleedingPaths.slice(1).some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <TopNavbar />}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <WishlistDrawer />}
      {!isAdminRoute && <WhatsAppButton />}
      {!isAdminRoute && <ContactFormModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />}


      <main className={`flex-1 ${!isAdminRoute && !isBleeding ? "pt-[100px] lg:pt-[190px]" : ""}`} style={!isAdminRoute && isBleeding ? { paddingTop: "0px" } : {}}>
        <Suspense fallback={<TileLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orders" element={<MyOrders />} />

            <Route path="/showrooms" element={<ShowroomPage />} />
            <Route path="/trade" element={<TradePage />} />

            {/* Dynamic Category Route */}
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            <Route path="/effect/concrete" element={<ShopByConcrete />} />
            <Route path="/effect/stone" element={<ShopByStone />} />
            <Route path="/effect/wood" element={<ShopByWood />} />
            <Route path="/effect/marble" element={<ShopByMarble />} />
            <Route path="/effect/metal" element={<ShopByMetal />} />
            <Route path="/effect/contemporary" element={<ShopByContemporary />} />
            <Route path="/effect/precious-metal" element={<ShopByPreciousMetal />} />
            <Route path="/effect/artisan" element={<ShopByArtisan />} />
            <Route path="/effect/carpet" element={<ShopByCarpet />} />
            <Route path="/format/small" element={<ShopBySmall />} />
            <Route path="/format/medium" element={<ShopByMedium />} />
            <Route path="/format/large" element={<ShopByLarge />} />
            <Route path="/format/slabs" element={<ShopBySlabs />} />
            <Route path="/format/planks" element={<ShopByPlanks />} />
            <Route path="/format/stripes" element={<ShopByStripes />} />
            <Route path="/format/chevron" element={<ShopByChevron />} />
            <Route path="/format/hexagon" element={<ShopByHexagon />} />
            <Route path="/colour/:colourName" element={<ColourPage />} />
            <Route path="/collection/absolute" element={<ShopByAbsolute />} />
            <Route path="/collection/alpi" element={<ShopByAlpi />} />
            <Route path="/collection/always" element={<ShopByAlways />} />
            <Route path="/collection/alchimia" element={<ShopByAlchimia />} />
            <Route path="/collection/arizona" element={<ShopByArizona />} />
            <Route path="/collection/bandw" element={<ShopByBAndW />} />
            <Route path="/collection/brooklyn" element={<ShopByBrooklyn />} />
            <Route path="/collection/brush" element={<ShopByBrush />} />
            <Route path="/collection/calabria" element={<ShopByCalabria />} />
            <Route path="/collection/cerdisa" element={<ShopByCerdisa />} />
            <Route path="/collection/chalet" element={<ShopByChalet />} />
            <Route path="/collection/channel" element={<ShopByChannel />} />
            <Route path="/collection/chester" element={<ShopByChester />} />
            <Route path="/collection/chelsea" element={<ShopByChelsea />} />
            <Route path="/collection/cimone" element={<ShopByCimone />} />
            <Route path="/collection/cromatica" element={<ShopByCromatica />} />
            <Route path="/collection/core" element={<ShopByCore />} />
            <Route path="/collection/corten" element={<ShopByCorten />} />
            <Route path="/collection/denver" element={<ShopByDenver />} />
            <Route path="/collection/esprit" element={<ShopByEsprit />} />
            <Route path="/collection/etruria" element={<ShopByEtruria />} />
            <Route path="/collection/externa" element={<ShopByExterna />} />
            <Route path="/collection/fidenza" element={<ShopByFidenza />} />
            <Route path="/collection/fresco" element={<ShopByFresco />} />
            <Route path="/collection/gatsby" element={<ShopByGatsby />} />
            <Route path="/collection/heritage" element={<ShopByHeritage />} />
            <Route path="/collection/imperia" element={<ShopByImperia />} />
            <Route path="/collection/kemberg" element={<ShopByKemberg />} />
            <Route path="/collection/laverton" element={<ShopByLaverton />} />
            <Route path="/collection/linea-oro" element={<ShopByLineaOro />} />
            <Route path="/collection/linea-plata" element={<ShopByLineaPlata />} />
            <Route path="/collection/mashup" element={<ShopByMashup />} />
            <Route path="/collection/motion" element={<ShopByMotion />} />
            <Route path="/collection/noon" element={<ShopByNoon />} />
            <Route path="/collection/oregon" element={<ShopByOregon />} />
            <Route path="/collection/oxford" element={<ShopByOxford />} />
            <Route path="/collection/page" element={<ShopByPage />} />
            <Route path="/collection/palmaria" element={<ShopByPalmaria />} />
            <Route path="/collection/policroma" element={<ShopByPolicroma />} />
            <Route path="/collection/poudre" element={<ShopByPoudre />} />
            <Route path="/collection/privilige" element={<ShopByPrivilige />} />
            <Route path="/collection/rift" element={<ShopByRift />} />
            <Route path="/collection/seattle" element={<ShopBySeattle />} />
            <Route path="/collection/serpal" element={<ShopBySerpal />} />
            <Route path="/collection/spazzio" element={<ShopBySpazzio />} />
            <Route path="/collection/specchio-oro" element={<ShopBySpecchioOro />} />
            <Route path="/collection/spruzza-oro" element={<ShopBySpruzzaOro />} />
            <Route path="/collection/stream" element={<ShopByStream />} />
            <Route path="/collection/walks" element={<ShopByWalks />} />
            <Route path="/collection/weekend" element={<ShopByWeekend />} />
            <Route path="/Shop By Sample" element={<ShopBySample />} />
            <Route path="/collections" element={<AllCollectionsPage />} />
            <Route path="/group/:groupName" element={<ShopGroupPage />} />

            {/* Compatibility Redirects */}
            <Route path="/kitchen" element={<CategoryPage />} />
            <Route path="/livingroom" element={<CategoryPage />} />

            {/* Admin Routes - Login must come first, before the wildcard */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />


            {/* Catch-all 404 */}
            <Route path="*" element={<div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
              <h1 className="text-9xl font-black text-blue-600/10 absolute select-none">404</h1>
              <h2 className="text-4xl font-black text-gray-900 mb-4 relative">Lost in Space?</h2>
              <p className="text-gray-500 max-w-md mb-8 relative">The page you're looking for doesn't exist. Let's get you back to the premium collections.</p>
              <Link to="/" className="px-8 py-3 bg-blue-600 text-white font-black rounded-none shadow-xl hover:bg-black transition-all relative">Back to Home</Link>
            </div>} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer onContactClick={() => setIsContactOpen(true)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
