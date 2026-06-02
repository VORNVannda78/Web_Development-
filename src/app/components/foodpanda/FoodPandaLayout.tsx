import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  Search, ShoppingCart, ChevronDown, MapPin, Menu, X,
  Tag, Globe, LogOut, User, Heart, Home, ClipboardList, Gift
} from "lucide-react";
import { EatZoneLogoIcon } from "./EatZoneLogo";
import { LiveChatWidget } from "./LiveChatWidget";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

const PINK = "#D70F64";

const CITIES = ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampot"];

export function FoodPandaLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, openAuthModal, deliveryMode, setDeliveryMode } = useAuth();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Phnom Penh");
  const [showCity, setShowCity] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCity(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/food");
  };

  const isHome = location.pathname === "/food";
  const isCart = location.pathname === "/food/cart";
  const isFavorites = location.pathname === "/food/favorites";
  const isOrders = location.pathname === "/food/orders";
  const isPromos = location.pathname === "/food/promotions";

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ backgroundColor: "#f8f8f8" }}>
      <AuthModal />

      {/* ── TOP HEADER ── */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-3">

            {/* Logo */}
            <button onClick={() => navigate("/food")} className="flex items-center gap-2 flex-shrink-0 mr-2">
              <EatZoneLogoIcon size={32} />
              <span className="font-black text-xl tracking-tight hidden sm:block" style={{ color: PINK }}>EatZone</span>
            </button>

            {/* Delivery/Pickup toggle — desktop */}
            <div className="hidden md:flex flex-shrink-0 items-center bg-gray-100 rounded-lg p-0.5">
              {(["Delivery", "Pick up"] as const).map((t) => {
                const mode = t === "Delivery" ? "delivery" : "pickup";
                const active = deliveryMode === mode;
                return (
                  <button
                    key={t}
                    onClick={() => setDeliveryMode(mode)}
                    className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                    style={active ? { backgroundColor: PINK, color: "#fff" } : { color: "#666" }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Location — desktop */}
            <div className="hidden md:block relative flex-shrink-0" ref={cityRef}>
              <button
                onClick={() => setShowCity(!showCity)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 h-9 text-sm hover:border-pink-300 transition-colors bg-white"
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: PINK }} />
                <span className="font-semibold text-gray-800 max-w-28 truncate">{city}</span>
                <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
              </button>
              {showCity && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 py-1">
                  {CITIES.map((c) => (
                    <button key={c} onClick={() => { setCity(c); setShowCity(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-pink-50 transition-colors">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c === city ? PINK : "#9ca3af" }} />
                      <span className={c === city ? "font-bold" : ""} style={c === city ? { color: PINK } : { color: "#374151" }}>{c}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={deliveryMode === "delivery" ? "Search for restaurant or cuisine" : "Search for pickup restaurants"}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-gray-100 border border-transparent focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                />
              </div>
            </form>

            {/* Right nav — desktop */}
            <div className="hidden md:flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={() => navigate("/food/promotions")}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={isPromos ? { color: PINK, backgroundColor: "#fff0f6" } : { color: "#374151" }}
              >
                <Tag className="w-3.5 h-3.5" />
                Promotions
              </button>

              {/* Favorites — desktop */}
              <button
                onClick={() => navigate("/food/favorites")}
                className="relative flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors"
                style={isFavorites ? { color: PINK, backgroundColor: "#fff0f6" } : { color: "#374151" }}
              >
                <Heart className="w-4 h-4" style={{ fill: isFavorites ? PINK : "transparent", stroke: isFavorites ? PINK : "currentColor" }} />
                {favorites.size > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-black"
                    style={{ backgroundColor: PINK, fontSize: 9 }}>{favorites.size}</span>
                )}
              </button>

              {/* Orders — desktop */}
              <button
                onClick={() => navigate("/food/orders")}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors"
                style={isOrders ? { color: PINK, backgroundColor: "#fff0f6" } : { color: "#374151" }}
              >
                <ClipboardList className="w-4 h-4" />
              </button>

              <button className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">EN</span>
              </button>

              {user ? (
                <div className="relative ml-1" ref={userMenuRef}>
                  <button onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ backgroundColor: PINK }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-gray-800 max-w-24 truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 py-1">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <div className="font-bold text-gray-900 text-sm truncate">{user.name}</div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      </div>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors text-gray-700">
                        <User className="w-3.5 h-3.5 text-gray-400" /> My Profile
                      </button>
                      <button onClick={() => { navigate("/food/orders"); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors text-gray-700">
                        <ClipboardList className="w-3.5 h-3.5 text-gray-400" /> My Orders
                      </button>
                      <button onClick={() => { navigate("/food/orders"); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors text-gray-700">
                        <Gift className="w-3.5 h-3.5 text-gray-400" /> Reward Points
                      </button>
                      <div className="border-t border-gray-50 mt-1" />
                      <button onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-red-50 transition-colors text-red-500">
                        <LogOut className="w-3.5 h-3.5" /> Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => openAuthModal()}
                    className="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors ml-1">
                    Log in
                  </button>
                  <button onClick={() => openAuthModal()}
                    className="px-4 py-1.5 rounded-lg text-sm font-bold text-white ml-1 transition-opacity hover:opacity-90"
                    style={{ backgroundColor: PINK }}>
                    Sign up
                  </button>
                </>
              )}

              <button onClick={() => navigate("/food/cart")} className="relative p-2 ml-1 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-black"
                    style={{ backgroundColor: PINK, fontSize: 9 }}>{totalItems}</span>
                )}
              </button>
            </div>

            {/* Hamburger — mobile */}
            <div className="md:hidden flex items-center gap-2">
              {/* Cart icon mobile */}
              <button onClick={() => navigate("/food/cart")} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-black"
                    style={{ backgroundColor: PINK, fontSize: 9 }}>{totalItems}</span>
                )}
              </button>
              <button onClick={() => setShowMobile(!showMobile)} className="p-2 -mr-2 rounded-lg hover:bg-gray-100">
                {showMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobile && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              {(["Delivery", "Pick up"] as const).map((t) => {
                const mode = t === "Delivery" ? "delivery" : "pickup";
                const active = deliveryMode === mode;
                return (
                  <button key={t} onClick={() => setDeliveryMode(mode)}
                    className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                    style={active ? { backgroundColor: PINK, color: "#fff" } : { color: "#666" }}>
                    {t}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 py-2 border-b border-gray-100">
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: PINK }} />
              <select value={city} onChange={(e) => setCity(e.target.value)}
                className="flex-1 text-sm font-semibold text-gray-800 bg-transparent focus:outline-none">
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={() => { navigate("/food/promotions"); setShowMobile(false); }}
              className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold hover:bg-pink-50 transition-colors"
              style={{ color: PINK }}>
              <Tag className="w-4 h-4" /> Promotions
            </button>
            <button onClick={() => { navigate("/food/favorites"); setShowMobile(false); }}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold hover:bg-pink-50 transition-colors"
              style={{ color: isFavorites ? PINK : "#374151" }}>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" style={{ fill: isFavorites ? PINK : "transparent", stroke: isFavorites ? PINK : "currentColor" }} />
                Saved
              </span>
              {favorites.size > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full text-white text-xs flex items-center justify-center font-black"
                  style={{ backgroundColor: PINK, fontSize: 10 }}>{favorites.size}</span>
              )}
            </button>
            {user ? (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black" style={{ backgroundColor: PINK }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-800 text-sm">{user.name}</span>
                </div>
                <button onClick={logout} className="text-sm font-bold text-red-500 flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => { openAuthModal(); setShowMobile(false); }} className="w-full py-2.5 rounded-lg text-sm font-bold border border-gray-200 text-gray-700">Log in</button>
                <button onClick={() => { openAuthModal(); setShowMobile(false); }} className="w-full py-2.5 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: PINK }}>Sign up</button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Pickup mode banner */}
      {deliveryMode === "pickup" && (
        <div className="bg-amber-50 border-b border-amber-200 py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <span className="text-lg">🏪</span>
            <span className="font-semibold text-amber-800">Pick Up mode — showing restaurants available for self-collection</span>
            <button onClick={() => setDeliveryMode("delivery")} className="ml-auto text-xs font-bold text-amber-700 underline">
              Switch to Delivery
            </button>
          </div>
        </div>
      )}

      {/* Page */}
      <main><Outlet /></main>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#1a1a1a" }} className="mt-16 text-gray-400 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <EatZoneLogoIcon size={32} />
                <span className="font-black text-white text-lg">EatZone</span>
              </div>
              <p className="text-xs leading-5 text-gray-500">Delivering happiness across Cambodia. Discover the best food with EatZone.</p>
              <div className="flex gap-3 mt-4">
                {["🍎", "🤖"].map((icon, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 cursor-pointer hover:bg-gray-700">
                    <span>{icon}</span>
                    <span>{i === 0 ? "App Store" : "Google Play"}</span>
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Company", links: ["About Us", "Careers", "Blog", "Press", "Investor Relations"] },
              { title: "More Info", links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "FAQ", "Sitemap"] },
              { title: "For Businesses", links: ["List your restaurant", "Rider FAQ", "EatZone for Business", "Partner with us"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <span>© 2026 EatZone Cambodia</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><span>🇰🇭</span> Cambodia</span>
              <span>|</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── LIVE CHAT WIDGET ── */}
      <LiveChatWidget />

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
        style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}>
        <div className="grid grid-cols-5 items-center h-16 px-2">

          {/* Home */}
          <button onClick={() => navigate("/food")}
            className="flex flex-col items-center gap-1 py-2 transition-colors"
            style={isHome ? { color: PINK } : { color: "#9ca3af" }}>
            <Home className="w-5 h-5" />
            <span className="text-xs font-semibold">Home</span>
            {isHome && <div className="absolute bottom-0 w-5 h-0.5 rounded-full" style={{ backgroundColor: PINK }} />}
          </button>

          {/* Promotions */}
          <button onClick={() => navigate("/food/promotions")}
            className="flex flex-col items-center gap-1 py-2 transition-colors"
            style={isPromos ? { color: PINK } : { color: "#9ca3af" }}>
            <Tag className="w-5 h-5" />
            <span className="text-xs font-semibold">Deals</span>
          </button>

          {/* Cart — center, elevated */}
          <button onClick={() => navigate("/food/cart")}
            className="relative col-start-3 justify-self-center flex items-center justify-center w-14 h-14 rounded-full -mt-5 shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: PINK }}>
            <ShoppingCart className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-xs flex items-center justify-center font-black"
                style={{ color: PINK, fontSize: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>{totalItems}</span>
            )}
          </button>

          {/* Orders */}
          <button onClick={() => navigate("/food/orders")}
            className="flex flex-col items-center gap-1 py-2 transition-colors"
            style={isOrders ? { color: PINK } : { color: "#9ca3af" }}>
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs font-semibold">Orders</span>
          </button>

          {/* Profile */}
          <button onClick={() => user ? undefined : openAuthModal()}
            className="flex flex-col items-center gap-1 py-2 transition-colors"
            style={{ color: "#9ca3af" }}>
            {user ? (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: PINK }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className="w-5 h-5" />
            )}
            <span className="text-xs font-semibold">{user ? user.name.split(" ")[0] : "Profile"}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
