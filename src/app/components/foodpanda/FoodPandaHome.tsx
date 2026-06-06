import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Search, MapPin, ChevronDown, ChevronLeft, ChevronRight,
  SlidersHorizontal, ChevronUp, Store, Pause, Play, RotateCcw
} from "lucide-react";
import { cuisineChips, fpRestaurants } from "../../data/foodpandaData";
import { RestaurantCard } from "./RestaurantCard";
import { SkeletonGrid } from "./SkeletonCard";
import { useAuth } from "../../context/AuthContext";

const PINK = "#D70F64";
const BANNER_INTERVAL = 5000;

const filterTabs = ["All", "Free delivery", "Deals", "New", "Open now"];
const pickupFilterTabs = ["All", "Deals", "New", "Open now"];
const sortOptions = ["Recommended", "Rating", "Delivery time", "Min. order", "Nearest", "Cheapest delivery"];

const discoveryFilters = [
  { id: "near", label: "Near me", hint: "Fastest delivery" },
  { id: "top", label: "Top rated", hint: "4.5+ stars" },
  { id: "always", label: "Open 24 hours", hint: "Available anytime" },
  { id: "cheap", label: "Cheap delivery", hint: "$1 or less" },
];

const smartSearchTerms: Record<string, string> = {
  piza: "Pizza",
  pizaa: "Pizza",
  burgur: "Burger",
  burgr: "Burger",
  chiken: "Chicken",
  chikenburger: "Chicken",
  noodls: "Noodles",
  nodle: "Noodles",
  coffe: "Coffee",
  desert: "Desserts",
};

const heroBanners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=500&fit=crop&q=80",
    bg: "linear-gradient(90deg, rgba(215,15,100,0.82) 0%, rgba(215,15,100,0.45) 60%, transparent 100%)",
    title: "Hungry? We deliver! 🍽️",
    sub: "Order food from your favourite restaurants",
    cta: "Order Now",
    badge: null,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&h=500&fit=crop&q=80",
    bg: "linear-gradient(90deg, rgba(230,126,34,0.88) 0%, rgba(230,126,34,0.5) 60%, transparent 100%)",
    title: "20% Off First 3 Orders",
    sub: "Use code EATZONE20 at checkout",
    cta: "Claim Offer",
    badge: "LIMITED",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&h=500&fit=crop&q=80",
    bg: "linear-gradient(90deg, rgba(142,68,173,0.88) 0%, rgba(142,68,173,0.5) 60%, transparent 100%)",
    title: "Free Delivery Weekend",
    sub: "On orders above $8 — every Saturday & Sunday",
    cta: "Browse Restaurants",
    badge: "FREE",
  },
];

const pickupBanners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1400&h=500&fit=crop&q=80",
    bg: "linear-gradient(90deg, rgba(9,132,227,0.88) 0%, rgba(9,132,227,0.5) 60%, transparent 100%)",
    title: "Pick Up & Save! 🏪",
    sub: "Skip the delivery fee — collect your order yourself",
    cta: "Find Nearby",
    badge: null,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&h=500&fit=crop&q=80",
    bg: "linear-gradient(90deg, rgba(0,184,148,0.88) 0%, rgba(0,184,148,0.5) 60%, transparent 100%)",
    title: "Ready in 15 mins ⚡",
    sub: "Order ahead and pick up when it's ready",
    cta: "Order Ahead",
    badge: "FAST",
  },
];

const featuredDeals = fpRestaurants.filter((r) => r.hasDeal && r.isOpen).slice(0, 6);

// Simulated "order again" restaurants (top-rated open ones)
const orderAgainRestaurants = fpRestaurants
  .filter((r) => r.isOpen && r.rating >= 4.4)
  .slice(0, 5)
  .map((r) => ({
    ...r,
    lastOrder: ["Amok Fish + Rice", "Crispy Burger", "BBQ Set", "Pad Thai", "Fried Rice"][
      Math.floor(Math.random() * 5)
    ],
    lastOrderDate: ["Yesterday", "2 days ago", "Last week", "3 days ago"][
      Math.floor(Math.random() * 4)
    ],
  }));

export function FoodPandaHome() {
  const navigate = useNavigate();
  const { deliveryMode, setDeliveryMode } = useAuth();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [address, setAddress] = useState("Phnom Penh");
  const [showAddressList, setShowAddressList] = useState(false);
  const [filterTab, setFilterTab] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showSort, setShowSort] = useState(false);
  const [showAdvFilters, setShowAdvFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]);
  const [discoveryFilter, setDiscoveryFilter] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const progressRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addresses = ["Phnom Penh", "BKK1, Phnom Penh", "Toul Kork, Phnom Penh", "Daun Penh, Phnom Penh", "Sen Sok, Phnom Penh", "Siem Reap"];
  const banners = deliveryMode === "pickup" ? pickupBanners : heroBanners;
  const tabs = deliveryMode === "pickup" ? pickupFilterTabs : filterTabs;
  const safeBannerIdx = bannerIdx % banners.length;
  const normalizedSearch = searchText.trim().toLowerCase();
  const smartSuggestion = normalizedSearch ? smartSearchTerms[normalizedSearch] : "";
  const effectiveSearch = (smartSuggestion || searchText).trim().toLowerCase();

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, [deliveryMode]);

  const resetProgress = useCallback(() => {
    setProgress(0);
    progressRef.current = 0;
  }, []);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    resetProgress();
    progressIntervalRef.current = setInterval(() => {
      progressRef.current += 100 / (BANNER_INTERVAL / 100);
      setProgress(Math.min(progressRef.current, 100));
    }, 100);
    intervalRef.current = setInterval(() => {
      setBannerIdx((i) => (i + 1) % banners.length);
      resetProgress();
    }, BANNER_INTERVAL);
  }, [banners.length, resetProgress]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying) startAutoPlay();
    else stopAutoPlay();
    return stopAutoPlay;
  }, [isPlaying, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    setBannerIdx(0);
    resetProgress();
  }, [deliveryMode, resetProgress]);

  const nextBanner = () => { setBannerIdx((i) => (i + 1) % banners.length); resetProgress(); };
  const prevBanner = () => { setBannerIdx((i) => (i - 1 + banners.length) % banners.length); resetProgress(); };

  const filtered = fpRestaurants.filter((r) => {
    if (filterTab === "Free delivery" && r.deliveryFee !== 0) return false;
    if (filterTab === "Deals" && !r.hasDeal) return false;
    if (filterTab === "New" && !r.isNew) return false;
    if (filterTab === "Open now" && !r.isOpen) return false;
    if (selectedCuisine !== "all") {
      const chip = cuisineChips.find((c) => c.id === selectedCuisine);
      if (chip && !r.cuisines.some((c) => c.toLowerCase() === chip.name.toLowerCase())) return false;
    }
    if (priceFilter.length > 0) {
      const priceMatch = priceFilter.some((p) => {
        if (p === "$" && r.minOrder <= 5) return true;
        if (p === "$$" && r.minOrder > 5 && r.minOrder <= 12) return true;
        if (p === "$$$" && r.minOrder > 12) return true;
        return false;
      });
      if (!priceMatch) return false;
    }
    if (dietaryFilter.includes("Vegetarian") && !r.cuisines.some(c => ["Healthy", "Salads"].includes(c))) return false;
    if (dietaryFilter.includes("Halal") && !r.isHalal) return false;
    if (discoveryFilter.includes("near") && parseInt(r.deliveryTime) > 25) return false;
    if (discoveryFilter.includes("top") && r.rating < 4.5) return false;
    if (discoveryFilter.includes("always") && (!r.isOpen || !["Breakfast", "Drinks", "Groceries"].some((c) => r.cuisines.includes(c)))) return false;
    if (discoveryFilter.includes("cheap") && r.deliveryFee > 1) return false;
    if (effectiveSearch) {
      return r.name.toLowerCase().includes(effectiveSearch) ||
        r.cuisines.some((c) => c.toLowerCase().includes(effectiveSearch));
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "Rating") return b.rating - a.rating;
    if (sortBy === "Delivery time") return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    if (sortBy === "Min. order") return a.minOrder - b.minOrder;
    if (sortBy === "Nearest") return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    if (sortBy === "Cheapest delivery") return a.deliveryFee - b.deliveryFee;
    return b.rating - a.rating;
  });

  return (
    <div>
      {/* ── HERO BANNER ── */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: 260 }}
        onMouseEnter={() => { if (isPlaying) stopAutoPlay(); }}
        onMouseLeave={() => { if (isPlaying) startAutoPlay(); }}
      >
        {banners.map((b, i) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: i === safeBannerIdx ? 1 : 0,
              backgroundImage: `url(${b.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ background: banners[safeBannerIdx].bg }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="max-w-2xl">
            {banners[safeBannerIdx].badge && (
              <span className="inline-block text-xs font-black px-3 py-1 rounded-full mb-3 tracking-widest"
                style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "#fff", backdropFilter: "blur(4px)" }}>
                {banners[safeBannerIdx].badge}
              </span>
            )}
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-1 drop-shadow-md">
              {banners[safeBannerIdx].title}
            </h1>
            <p className="text-white/85 text-sm md:text-base mb-6 drop-shadow">{banners[safeBannerIdx].sub}</p>

            <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-xl p-1 mb-4">
              {(["Delivery", "Pick up"] as const).map((t) => {
                const mode = t === "Delivery" ? "delivery" : "pickup";
                const active = deliveryMode === mode;
                return (
                  <button key={t} onClick={() => { setDeliveryMode(mode); setBannerIdx(0); setFilterTab("All"); }}
                    className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
                    style={active ? { backgroundColor: "#fff", color: PINK } : { color: "rgba(255,255,255,0.85)" }}>
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 relative">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: PINK }} />
                <input
                  type="text"
                  value={address}
                  onFocus={() => setShowAddressList(true)}
                  onBlur={() => setTimeout(() => setShowAddressList(false), 150)}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={deliveryMode === "delivery" ? "Enter your delivery address" : "Enter your area"}
                  className="w-full h-12 pl-10 pr-10 bg-white rounded-xl text-sm text-gray-800 font-medium focus:outline-none placeholder:text-gray-400"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {showAddressList && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-30">
                    {addresses.filter((a) => a.toLowerCase().includes(address.toLowerCase())).map((a) => (
                      <button key={a} onMouseDown={() => { setAddress(a); setShowAddressList(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left hover:bg-pink-50 text-gray-700 transition-colors">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => navigate("/food")}
                className="h-12 px-6 rounded-xl font-black text-white text-sm flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ backgroundColor: PINK }}>
                {banners[safeBannerIdx].cta}
              </button>
            </div>
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <button onClick={prevBanner} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center transition-colors backdrop-blur-sm">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button onClick={nextBanner} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center transition-colors backdrop-blur-sm">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            {isPlaying ? <Pause className="w-3 h-3 text-white" /> : <Play className="w-3 h-3 text-white" />}
          </button>
          <div className="flex gap-2 items-center">
            {banners.map((_, i) => (
              <button key={i} onClick={() => { setBannerIdx(i); resetProgress(); }}
                className="relative rounded-full overflow-hidden transition-all"
                style={{ width: i === safeBannerIdx ? 28 : 6, height: 6, backgroundColor: "rgba(255,255,255,0.35)" }}>
                {i === safeBannerIdx && (
                  <div className="absolute left-0 top-0 h-full rounded-full bg-white transition-none"
                    style={{ width: `${progress}%` }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Pickup info bar */}
        {deliveryMode === "pickup" && (
          <div className="mb-5 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-blue-900 text-sm">Self-Pickup Available</div>
              <div className="text-xs text-blue-600">All restaurants below support walk-in pickup. No delivery fee!</div>
            </div>
          </div>
        )}

        {/* ── Order Again ── */}
        {deliveryMode === "delivery" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" style={{ color: PINK }} />
                  Order Again
                </h2>
                <p className="text-xs text-gray-500">Pick up where you left off</p>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {orderAgainRestaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/food/restaurants/${r.id}`)}
                  className="flex-shrink-0 bg-white rounded-2xl overflow-hidden text-left hover:shadow-md transition-all group"
                  style={{ width: 180, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}
                >
                  <div className="relative overflow-hidden" style={{ height: 100 }}>
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                    <div className="absolute bottom-1.5 left-2.5 right-2.5">
                      <p className="text-white font-bold text-xs leading-tight line-clamp-1">{r.name}</p>
                    </div>
                  </div>
                  <div className="px-2.5 py-2">
                    <p className="text-xs text-gray-700 font-semibold line-clamp-1">{r.lastOrder}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.lastOrderDate}</p>
                    <div className="mt-2 w-full py-1.5 rounded-lg text-xs font-bold text-center transition-colors"
                      style={{ backgroundColor: "#fff0f6", color: PINK }}>
                      Reorder
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Featured Deals ── */}
        {deliveryMode === "delivery" && featuredDeals.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-black text-gray-900">🔥 Featured Deals</h2>
                <p className="text-xs text-gray-500">Limited time offers just for you</p>
              </div>
              <button
                onClick={() => setFilterTab("Deals")}
                className="text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all"
                style={{ borderColor: PINK, color: PINK }}
              >
                See all
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {featuredDeals.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/food/restaurants/${r.id}`)}
                  className="flex-shrink-0 relative rounded-2xl overflow-hidden group"
                  style={{ width: 200, height: 120 }}
                >
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                  {r.badge && (
                    <div className="absolute top-2 left-2 text-white text-xs font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: r.badge.color, fontSize: 10 }}>
                      {r.badge.text}
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2.5 right-2.5">
                    <p className="text-white font-bold text-xs leading-tight line-clamp-1">{r.name}</p>
                    <p className="text-white/70 text-xs">{r.deliveryTime} min</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Cuisine Chips ── */}
        <div className="relative mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {cuisineChips.map((chip) => {
              const active = selectedCuisine === chip.id;
              return (
                <button key={chip.id} onClick={() => setSelectedCuisine(chip.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold border-2 transition-all whitespace-nowrap"
                  style={active
                    ? { backgroundColor: PINK, borderColor: PINK, color: "#fff" }
                    : { backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#374151" }
                  }>
                  <span>{chip.emoji}</span>
                  <span>{chip.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Filter tabs + Sort ── */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setFilterTab(tab)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                style={filterTab === tab
                  ? { backgroundColor: PINK, borderColor: PINK, color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#374151" }
                }>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvFilters(!showAdvFilters)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 bg-white text-xs font-bold text-gray-700 hover:border-gray-300 transition-colors"
              style={(priceFilter.length > 0 || dietaryFilter.length > 0 || discoveryFilter.length > 0)
                ? { borderColor: PINK, color: PINK, backgroundColor: "#fff0f6" }
                : { borderColor: "#e5e7eb" }}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {(priceFilter.length + dietaryFilter.length + discoveryFilter.length) > 0 && (
                <span className="w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-black"
                  style={{ backgroundColor: PINK, fontSize: 9 }}>
                  {priceFilter.length + dietaryFilter.length + discoveryFilter.length}
                </span>
              )}
            </button>
          </div>
          <div className="relative">
            <button onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-gray-200 bg-white text-xs font-bold text-gray-700 hover:border-gray-300 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sort: {sortBy}
              {showSort ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 py-1">
                {sortOptions.map((opt) => (
                  <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }}
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-pink-50 transition-colors font-medium"
                    style={sortBy === opt ? { color: PINK, fontWeight: 700 } : { color: "#374151" }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search inside listing */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search restaurants..." value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 transition-colors" />
        </div>

        {/* Advanced Filters Panel */}
        {showAdvFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price Range */}
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-wide block mb-2">💰 Price Range</label>
                <div className="flex gap-2">
                  {["$", "$$", "$$$"].map((p) => (
                    <button key={p}
                      onClick={() => setPriceFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                      className="flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all"
                      style={priceFilter.includes(p)
                        ? { borderColor: PINK, backgroundColor: "#fff0f6", color: PINK }
                        : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                  <span>Under $5</span><span>$5–$12</span><span>$12+</span>
                </div>
              </div>
              {/* Dietary */}
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-wide block mb-2">🥗 Dietary</label>
                <div className="flex gap-2 flex-wrap">
                  {["Vegetarian 🥦", "Halal ☪️", "Gluten-Free 🌾"].map((d) => {
                    const key = d.split(" ")[0];
                    return (
                      <button key={d}
                        onClick={() => setDietaryFilter(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key])}
                        className="px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all"
                        style={dietaryFilter.includes(key)
                          ? { borderColor: PINK, backgroundColor: "#fff0f6", color: PINK }
                          : { borderColor: "#e5e7eb", color: "#6b7280" }}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {(priceFilter.length > 0 || dietaryFilter.length > 0) && (
              <button
                onClick={() => { setPriceFilter([]); setDietaryFilter([]); }}
                className="mt-3 text-xs font-bold text-gray-400 hover:text-gray-600 underline">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Count */}
        {!isLoading && (
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-bold text-gray-800">{filtered.length}</span>{" "}
            {deliveryMode === "pickup" ? "pickup spots" : "restaurants"} in {address}
          </p>
        )}

        {/* ── Restaurant Grid or Skeleton ── */}
        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-sm text-gray-400 mb-5">Try adjusting your filters or search</p>
            <button onClick={() => { setFilterTab("All"); setSelectedCuisine("all"); setSearchText(""); }}
              className="px-6 py-2.5 rounded-full font-bold text-white text-sm" style={{ backgroundColor: PINK }}>
              Show all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
