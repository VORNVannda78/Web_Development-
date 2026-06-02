import { useNavigate } from "react-router";
import { Heart, ArrowLeft } from "lucide-react";
import { fpRestaurants } from "../../data/foodpandaData";
import { useFavorites } from "../../context/FavoritesContext";
import { RestaurantCard } from "./RestaurantCard";

const PINK = "#D70F64";

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const savedRestaurants = fpRestaurants.filter((r) => favorites.has(r.id));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f8f8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/food")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5" style={{ fill: PINK, stroke: PINK }} />
              Saved Restaurants
            </h1>
            <p className="text-sm text-gray-500">
              {savedRestaurants.length} restaurant{savedRestaurants.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        {/* Empty state */}
        {savedRestaurants.length === 0 ? (
          <div className="py-28 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ backgroundColor: "#fff0f6" }}>
              <Heart className="w-9 h-9" style={{ stroke: PINK }} />
            </div>
            <h2 className="text-lg font-black text-gray-800 mb-2">No saved restaurants yet</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
              Tap the ❤️ heart on any restaurant card to save it here for quick access
            </p>
            <button
              onClick={() => navigate("/food")}
              className="px-8 py-3 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: PINK }}
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <>
            {/* Open restaurants */}
            {savedRestaurants.filter((r) => r.isOpen).length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Open Now · {savedRestaurants.filter((r) => r.isOpen).length}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {savedRestaurants.filter((r) => r.isOpen).map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              </div>
            )}

            {/* Closed restaurants */}
            {savedRestaurants.filter((r) => !r.isOpen).length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
                  Closed · {savedRestaurants.filter((r) => !r.isOpen).length}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 opacity-70">
                  {savedRestaurants.filter((r) => !r.isOpen).map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
