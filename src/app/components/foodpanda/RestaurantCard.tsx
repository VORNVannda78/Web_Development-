import { useNavigate } from "react-router";
import { Star, Clock, Heart } from "lucide-react";
import type { FPRestaurant } from "../../data/foodpandaData";
import { useFavorites } from "../../context/FavoritesContext";
import { useToast } from "../../context/ToastContext";

interface Props {
  restaurant: FPRestaurant;
}

const PINK = "#D70F64";

export function RestaurantCard({ restaurant: r }: Props) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorited } = useFavorites();
  const { showToast } = useToast();
  const favorited = isFavorited(r.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(r.id);
    showToast(
      favorited ? `Removed ${r.name} from saved` : `${r.name} saved! ❤️`,
      favorited ? "info" : "success"
    );
  };

  return (
    <button
      onClick={() => navigate(`/food/restaurants/${r.id}`)}
      className="group bg-white rounded-2xl overflow-hidden text-left w-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img
          src={r.image}
          alt={r.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Closed overlay */}
        {!r.isOpen && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="bg-white text-gray-700 font-bold text-sm px-5 py-2 rounded-full shadow">
              Closed
            </span>
          </div>
        )}

        {/* Discount/badge pill — top left */}
        {r.badge && r.isOpen && (
          <div
            className="absolute top-2.5 left-2.5 text-white text-xs font-black px-2.5 py-1 rounded-full"
            style={{ backgroundColor: r.badge.color, fontSize: 11 }}
          >
            {r.badge.text}
          </div>
        )}

        {/* NEW pill */}
        {r.isNew && !r.badge && r.isOpen && (
          <div className="absolute top-2.5 left-2.5 text-white text-xs font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: "#198754", fontSize: 11 }}>
            New
          </div>
        )}

        {/* Free delivery pill */}
        {r.deliveryFee === 0 && !r.badge && !r.isNew && r.isOpen && (
          <div className="absolute top-2.5 left-2.5 text-white text-xs font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: "#198754", fontSize: 11 }}>
            Free delivery
          </div>
        )}

        {/* ── Favorite button — top right ── */}
        <button
          onClick={handleFavorite}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: favorited ? PINK : "rgba(255,255,255,0.92)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.18)",
          }}
        >
          <Heart
            className="w-3.5 h-3.5 transition-all"
            style={{
              fill: favorited ? "#fff" : "transparent",
              stroke: favorited ? "#fff" : PINK,
              strokeWidth: 2.2,
            }}
          />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="p-3 pb-3.5">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 leading-snug line-clamp-1 text-sm">{r.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div
              className="flex items-center gap-0.5 rounded px-1.5 py-0.5"
              style={{ backgroundColor: r.rating >= 4.5 ? "#198754" : r.rating >= 4 ? "#5cb85c" : "#f0ad4e" }}
            >
              <Star className="w-2.5 h-2.5 fill-white text-white" />
              <span className="text-white text-xs font-bold">{r.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-400">({r.reviewCount >= 1000 ? (r.reviewCount / 1000).toFixed(1) + "k" : r.reviewCount}+)</span>
          </div>
        </div>

        {/* Cuisines */}
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{r.cuisines.join(" • ")}</p>

        {/* Delivery info */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{r.deliveryTime} min</span>
          </div>
          <span className="text-gray-300">·</span>
          {r.deliveryFee === 0 ? (
            <span className="font-semibold" style={{ color: "#198754" }}>Free delivery</span>
          ) : (
            <span>${r.deliveryFee.toFixed(2)} delivery</span>
          )}
          <span className="text-gray-300">·</span>
          <span>Min. ${r.minOrder}</span>
        </div>
      </div>
    </button>
  );
}
