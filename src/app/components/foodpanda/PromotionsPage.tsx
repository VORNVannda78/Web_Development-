import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Tag, Copy, Check, Clock, Zap, Gift, Truck, Star, ChevronRight } from "lucide-react";

const PINK = "#D70F64";

interface Voucher {
  code: string;
  desc: string;
  discount: string;
  minOrder: string;
  expires: string;
  color: string;
  icon: React.ReactNode;
  category: string;
}

const vouchers: Voucher[] = [
  { code: "EATZONE20", desc: "20% off your order", discount: "20% OFF", minOrder: "Min. $10", expires: "31 May 2026", color: PINK, icon: <Tag className="w-5 h-5" />, category: "New User" },
  { code: "FREEDEL", desc: "Free delivery on any order", discount: "FREE DELIVERY", minOrder: "Min. $5", expires: "30 Jun 2026", color: "#198754", icon: <Truck className="w-5 h-5" />, category: "All Users" },
  { code: "KHMER15", desc: "15% off Khmer food", discount: "15% OFF", minOrder: "Min. $8", expires: "15 Jun 2026", color: "#e67e22", icon: <Star className="w-5 h-5" />, category: "Khmer Cuisine" },
  { code: "WEEKEND30", desc: "30% off every Saturday & Sunday", discount: "30% OFF", minOrder: "Min. $12", expires: "Every weekend", color: "#8e44ad", icon: <Gift className="w-5 h-5" />, category: "Weekend" },
  { code: "FIRST50", desc: "50% off your first order", discount: "50% OFF", minOrder: "Min. $6", expires: "One-time use", color: "#e74c3c", icon: <Zap className="w-5 h-5" />, category: "First Order" },
  { code: "LUNCH10", desc: "Extra 10% off 11am–2pm orders", discount: "10% OFF", minOrder: "Min. $7", expires: "30 Jun 2026", color: "#0984e3", icon: <Clock className="w-5 h-5" />, category: "Lunch Deal" },
];

const flashDeals = [
  { id: "r1", name: "KFC Cambodia", image: "https://images.unsplash.com/photo-1766589221522-d5beae155124?w=400&h=200&fit=crop", deal: "20% off all buckets", badge: "Ends in 2h", endsIn: 2 * 3600 },
  { id: "r4", name: "The Pizza Company", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=200&fit=crop", deal: "Buy 1 Get 1 Free on Large pizzas", badge: "Ends in 5h", endsIn: 5 * 3600 },
  { id: "r7", name: "Swensen's Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=200&fit=crop", deal: "15% off + Free sundae", badge: "Ends in 8h", endsIn: 8 * 3600 },
  { id: "r9", name: "Boeng Kak BBQ", image: "https://images.unsplash.com/photo-1544025162-d76594f0b5d8?w=400&h=200&fit=crop", deal: "10% off BBQ platters", badge: "Ends in 12h", endsIn: 12 * 3600 },
];

const heroBanners = [
  { bg: `linear-gradient(135deg, ${PINK} 0%, #ff4d94 100%)`, title: "🎉 Mega Promo Week!", sub: "Up to 50% off your favourite restaurants", cta: "Claim Now" },
  { bg: "linear-gradient(135deg, #e67e22 0%, #f39c12 100%)", title: "🆓 Free Delivery Days", sub: "Use code FREEDEL — every order, any restaurant", cta: "Order Now" },
  { bg: "linear-gradient(135deg, #8e44ad 0%, #3498db 100%)", title: "🌟 Weekend Specials", sub: "30% off every Saturday & Sunday this month", cta: "Get Deal" },
];

function CountdownBadge({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return (
    <div className="flex items-center gap-1">
      {[h, m, s].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-gray-900 text-white text-xs font-black px-1.5 py-0.5 rounded-md min-w-[24px] text-center">
            {String(v).padStart(2, "0")}
          </span>
          {i < 2 && <span className="text-gray-500 font-black text-xs">:</span>}
        </span>
      ))}
    </div>
  );
}

function VoucherCard({ v }: { v: Voucher }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(v.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      {/* Colored stripe */}
      <div className="w-2 flex-shrink-0" style={{ backgroundColor: v.color }} />
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: v.color }}>
              {v.icon}
            </div>
            <div>
              <div className="font-black text-gray-900 text-sm">{v.discount}</div>
              <div className="text-xs text-gray-500">{v.desc}</div>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: `${v.color}15`, color: v.color }}>
            {v.category}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 w-fit">
              <span className="font-black text-gray-800 text-sm tracking-wider">{v.code}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">{v.minOrder} · Expires {v.expires}</div>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
            style={{ backgroundColor: copied ? "#198754" : v.color }}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PromotionsPage() {
  const navigate = useNavigate();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % heroBanners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const categories = ["All", "New User", "First Order", "Weekend", "Khmer Cuisine", "Lunch Deal"];
  const filtered = activeCategory === "All" ? vouchers : vouchers.filter((v) => v.category === activeCategory);

  return (
    <div style={{ backgroundColor: "#f8f8f8" }} className="min-h-screen pb-16">

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: heroBanners[bannerIdx].bg, minHeight: 200 }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-white -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full opacity-10 bg-white translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{heroBanners[bannerIdx].title}</h1>
          <p className="text-white/80 text-base mb-6">{heroBanners[bannerIdx].sub}</p>
          <button className="px-8 py-3 bg-white rounded-xl font-black text-sm transition-opacity hover:opacity-90" style={{ color: PINK }}>
            {heroBanners[bannerIdx].cta}
          </button>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {heroBanners.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)}
              className="rounded-full transition-all"
              style={{ width: i === bannerIdx ? 20 : 6, height: 6, backgroundColor: i === bannerIdx ? "#fff" : "rgba(255,255,255,0.4)" }} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ── Flash Deals ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#e67e22" }}>
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="font-black text-gray-900 text-xl">⚡ Flash Deals</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white ml-1" style={{ backgroundColor: "#e67e22" }}>Limited time</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashDeals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => navigate(`/food/restaurants/${deal.id}`)}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 hover:shadow-lg transition-shadow"
                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
              >
                <div className="relative">
                  <img src={deal.image} alt={deal.name} className="w-full h-32 object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: "#e67e22" }}>
                    {deal.badge}
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-gray-900 text-sm mb-1">{deal.name}</div>
                  <div className="text-xs font-semibold mb-2" style={{ color: PINK }}>{deal.deal}</div>
                  <CountdownBadge seconds={deal.endsIn} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Promo Vouchers ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: PINK }}>
              <Tag className="w-4 h-4" />
            </div>
            <h2 className="font-black text-gray-900 text-xl">🎟️ Promo Vouchers</h2>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all whitespace-nowrap"
                style={activeCategory === cat
                  ? { backgroundColor: PINK, borderColor: PINK, color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#374151" }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((v) => <VoucherCard key={v.code} v={v} />)}
          </div>
        </section>

        {/* ── Partner Offers ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#0984e3" }}>
              <Star className="w-4 h-4" />
            </div>
            <h2 className="font-black text-gray-900 text-xl">🤝 Partner Offers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "ABA Bank", sub: "5% cashback when you pay with ABA", icon: "🏦", color: "#0984e3", badge: "Banking" },
              { title: "Wing Money", sub: "Free delivery on your first Wing payment", icon: "💸", color: "#198754", badge: "Payments" },
              { title: "Smart Axiata", sub: "Double data when you order $15+", icon: "📱", color: "#e67e22", badge: "Telecom" },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-5 border border-gray-100 flex gap-4 items-start hover:shadow-md transition-shadow cursor-pointer" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: `${p.color}15` }}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-gray-900 text-sm">{p.title}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: p.color }}>{p.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </section>

        {/* ── How to use ── */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <h2 className="font-black text-gray-900 text-lg mb-5">How to use a promo code</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Copy the code", desc: "Click the Copy button on any voucher above", icon: "📋" },
              { step: "2", title: "Add items to cart", desc: "Browse restaurants and add your favourite items", icon: "🛒" },
              { step: "3", title: "Paste at checkout", desc: "Enter the code in the promo code field in your cart", icon: "✅" },
            ].map((s) => (
              <div key={s.step} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ backgroundColor: PINK }}>
                  {s.step}
                </div>
                <div>
                  <div className="text-lg mb-0.5">{s.icon}</div>
                  <div className="font-bold text-gray-900 text-sm">{s.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
