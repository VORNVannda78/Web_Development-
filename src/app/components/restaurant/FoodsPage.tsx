import { useState } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Search, X, Check } from "lucide-react";
import { foods as initialFoods, type Food } from "../../data/mockData";

const restaurantFoods = initialFoods.filter((f) => f.restaurantId === "r1");
const categories = ["All", "Khmer Food", "Fast Food", "Noodles", "BBQ", "Drinks", "Dessert"];

interface FoodFormData {
  name: string;
  price: string;
  description: string;
  category: string;
}

export function FoodsPage() {
  const [foods, setFoods] = useState(restaurantFoods);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState<FoodFormData>({ name: "", price: "", description: "", category: "Khmer Food" });

  const filtered = foods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || f.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const toggleAvailability = (id: string) => {
    setFoods((prev) => prev.map((f) => f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  };

  const deleteFood = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const openAddForm = () => {
    setEditingFood(null);
    setFormData({ name: "", price: "", description: "", category: "Khmer Food" });
    setShowForm(true);
  };

  const openEditForm = (food: Food) => {
    setEditingFood(food);
    setFormData({ name: food.name, price: food.price.toString(), description: food.description, category: food.category });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;
    if (editingFood) {
      setFoods((prev) => prev.map((f) => f.id === editingFood.id
        ? { ...f, ...formData, price: parseFloat(formData.price), category: formData.category as Food["category"] }
        : f
      ));
    } else {
      const newFood: Food = {
        id: `f${Date.now()}`,
        restaurantId: "r1",
        name: formData.name,
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
        price: parseFloat(formData.price),
        category: formData.category as Food["category"],
        description: formData.description,
        isAvailable: true,
        rating: 4.5,
      };
      setFoods((prev) => [...prev, newFood]);
    }
    setShowForm(false);
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <h1 className="font-black text-lg text-gray-900">Menu Items</h1>
        <button
          onClick={openAddForm}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Food
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-3 bg-white border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none"
          />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                activeCategory === cat ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food List */}
      <div className="px-4 pt-4 space-y-3">
        <p className="text-xs text-gray-400">{filtered.length} items</p>
        {filtered.map((food) => (
          <div key={food.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex ${!food.isAvailable ? "opacity-60" : ""}`}>
            <img src={food.image} alt={food.name} className="w-24 h-24 object-cover" />
            <div className="flex-1 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{food.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{food.category}</div>
                  <div className="text-red-500 font-bold text-sm mt-1">${food.price.toFixed(2)}</div>
                </div>
                <button
                  onClick={() => toggleAvailability(food.id)}
                  className={`flex-shrink-0 ${food.isAvailable ? "text-green-500" : "text-gray-300"}`}
                >
                  {food.isAvailable ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${food.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {food.isAvailable ? "Available" : "Unavailable"}
                </span>
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    onClick={() => openEditForm(food)}
                    className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center"
                  >
                    <Edit2 className="w-3 h-3 text-blue-500" />
                  </button>
                  <button
                    onClick={() => deleteFood(food.id)}
                    className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowForm(false)}>
          <div
            className="bg-white w-full max-w-4xl mx-auto rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg text-gray-900">
                {editingFood ? "Edit Food" : "Add New Food"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Food Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Amok Fish"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Price (USD) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                  placeholder="0.00"
                  step="0.25"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  {["Khmer Food", "Fast Food", "Noodles", "BBQ", "Drinks", "Dessert"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your food..."
                  rows={3}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-5 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {editingFood ? "Save Changes" : "Add Food"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
