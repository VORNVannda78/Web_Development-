import { useNavigate } from "react-router";
import { ShoppingBag, Store, Bike, Shield, Star, Clock, MapPin } from "lucide-react";

const roles = [
  {
    icon: ShoppingBag,
    title: "Customer",
    subtitle: "Order delicious food",
    description: "Browse restaurants, order food, and track your delivery in real-time.",
    path: "/customer",
    gradient: "from-orange-400 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200 hover:border-orange-400",
  },
  {
    icon: Store,
    title: "Restaurant",
    subtitle: "Manage your menu",
    description: "Accept orders, manage your menu, and grow your business.",
    path: "/restaurant",
    gradient: "from-red-500 to-red-700",
    bg: "bg-red-50",
    border: "border-red-200 hover:border-red-400",
  },
  {
    icon: Bike,
    title: "Rider",
    subtitle: "Deliver & earn",
    description: "Accept deliveries, earn money, and help feed Phnom Penh.",
    path: "/rider",
    gradient: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200 hover:border-amber-400",
  },
  {
    icon: Shield,
    title: "Admin",
    subtitle: "Manage the platform",
    description: "Oversee restaurants, users, orders, and platform analytics.",
    path: "/admin",
    gradient: "from-gray-600 to-gray-800",
    bg: "bg-gray-50",
    border: "border-gray-200 hover:border-gray-400",
  },
];

const stats = [
  { label: "Restaurants", value: "500+", icon: Store },
  { label: "Happy Customers", value: "50K+", icon: Star },
  { label: "Fast Delivery", value: "30 min", icon: Clock },
  { label: "Cities", value: "5", icon: MapPin },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">NhamNow</h1>
          </div>
          <p className="text-xl md:text-2xl font-medium opacity-90 mb-3">
            🇰🇭 Cambodia's #1 Food Delivery Platform
          </p>
          <p className="text-base md:text-lg opacity-75 max-w-xl mx-auto mb-10">
            From traditional Khmer food to international cuisine — delivered fast to your door
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <stat.icon className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs opacity-75">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Who are you?</h2>
          <p className="text-gray-500">Select your role to access the right panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <button
              key={role.title}
              onClick={() => navigate(role.path)}
              className={`${role.bg} ${role.border} border-2 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <role.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">{role.title}</div>
              <div className="text-sm font-medium text-gray-600 mb-2">{role.subtitle}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{role.description}</div>
              <div className="mt-4 text-xs font-semibold text-red-500 flex items-center gap-1">
                Enter Panel →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Food Categories */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: "Khmer Food", emoji: "🍛", color: "bg-orange-100 text-orange-700" },
              { name: "Fast Food", emoji: "🍔", color: "bg-red-100 text-red-700" },
              { name: "Noodles", emoji: "🍜", color: "bg-yellow-100 text-yellow-700" },
              { name: "BBQ", emoji: "🥩", color: "bg-amber-100 text-amber-700" },
              { name: "Drinks", emoji: "🧃", color: "bg-blue-100 text-blue-700" },
              { name: "Dessert", emoji: "🍰", color: "bg-pink-100 text-pink-700" },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate("/customer")}
                className={`${cat.color} rounded-2xl p-4 text-center hover:scale-105 transition-transform`}
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="text-xs font-semibold">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShoppingBag className="w-5 h-5 text-red-500" />
          <span className="text-white font-bold">NhamNow</span>
        </div>
        <p>© 2026 NhamNow Cambodia. All rights reserved.</p>
        <p className="mt-1 text-xs">Similar to Nham24 · EatZone · GrabFood · E-GetS</p>
      </div>
    </div>
  );
}
