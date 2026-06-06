import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bike,
  CalendarClock,
  CheckCircle2,
  ChefHat,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Megaphone,
  PackageCheck,
  Phone,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Trash2,
  UtensilsCrossed,
  X,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  foods as initialFoods,
  orders as initialOrders,
  type Food,
  type FoodCategory,
  type PaymentMethod,
} from "../../data/mockData";

type MerchantView = "orders" | "menu" | "settings" | "reports";
type MerchantOrderStage = "new" | "preparing" | "ready" | "rejected";

interface MerchantOrderItem {
  foodName: string;
  quantity: number;
  price: number;
}

interface MerchantOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  items: MerchantOrderItem[];
  stage: MerchantOrderStage;
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  note?: string;
  isFresh?: boolean;
}

interface MenuFormData {
  name: string;
  price: string;
  description: string;
  category: FoodCategory;
  image: string;
}

const menuCategories: FoodCategory[] = ["Khmer Food", "Fast Food", "Noodles", "BBQ", "Drinks", "Dessert"];

const navItems = [
  { id: "orders" as const, label: "Orders", khmer: "ការបញ្ជាទិញ", icon: LayoutDashboard },
  { id: "menu" as const, label: "Menu", khmer: "ម៉ឺនុយម្ហូប", icon: UtensilsCrossed },
  { id: "settings" as const, label: "Store", khmer: "ការកំណត់ហាង", icon: Settings },
  { id: "reports" as const, label: "Reports", khmer: "របាយការណ៍", icon: BarChart3 },
];

const revenueData = [
  { day: "Mon", revenue: 188, orders: 24 },
  { day: "Tue", revenue: 236, orders: 31 },
  { day: "Wed", revenue: 201, orders: 27 },
  { day: "Thu", revenue: 292, orders: 39 },
  { day: "Fri", revenue: 341, orders: 45 },
  { day: "Sat", revenue: 418, orders: 56 },
  { day: "Sun", revenue: 365, orders: 48 },
];

const seedOrders: MerchantOrder[] = [
  ...initialOrders
    .filter((order) => order.restaurantId === "r1")
    .map<MerchantOrder>((order) => ({
      id: order.id,
      customerName: order.customerId === "u1" ? "Sophea Mao" : "Borey Chan",
      customerPhone: order.customerId === "u1" ? "012 100 200" : "012 300 400",
      items: order.items,
      stage: order.status === "Cooking" ? "preparing" : order.status === "Completed" ? "ready" : "new",
      totalAmount: order.totalAmount,
      deliveryFee: order.deliveryFee,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      note: order.note,
    })),
  {
    id: "ORD004",
    customerName: "Dara Lim",
    customerPhone: "012 555 818",
    items: [
      { foodName: "Amok Fish", quantity: 2, price: 6.5 },
      { foodName: "Bai Sach Chrouk", quantity: 1, price: 3.5 },
    ],
    stage: "new",
    totalAmount: 16.5,
    deliveryFee: 1.5,
    deliveryAddress: "Street 51, Phnom Penh",
    paymentMethod: "KHQR",
    createdAt: "2026-06-06T10:30:00",
    note: "Extra rice, no chili",
    isFresh: true,
  },
  {
    id: "ORD005",
    customerName: "Chantha Roeun",
    customerPhone: "012 778 909",
    items: [{ foodName: "Lok Lak", quantity: 1, price: 7 }],
    stage: "ready",
    totalAmount: 7,
    deliveryFee: 1.5,
    deliveryAddress: "Russian Market Area, Phnom Penh",
    paymentMethod: "Cash On Delivery",
    createdAt: "2026-06-06T09:54:00",
  },
];

const defaultForm: MenuFormData = {
  name: "",
  price: "",
  description: "",
  category: "Khmer Food",
  image: "",
};

function playAlertTone() {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) return;

  const context = new AudioContextConstructor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  oscillator.frequency.setValueAtTime(660, context.currentTime + 0.16);
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.38);
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function getWaitingStatus(createdAt: string, now: number) {
  const elapsedMs = Math.max(0, now - new Date(createdAt).getTime());
  const minutes = Math.floor(elapsedMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return { label: "Just now", isLate: false };
  if (minutes < 60) return { label: `${minutes} min${minutes === 1 ? "" : "s"} ago`, isLate: minutes >= 10 };
  if (hours < 24) return { label: `${hours} hr${hours === 1 ? "" : "s"} ago`, isLate: true };
  return { label: `${days} day${days === 1 ? "" : "s"} ago`, isLate: true };
}

function MerchantLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white grid lg:grid-cols-[1.15fr_0.85fr]">
      <section className="relative hidden lg:flex overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=900&fit=crop"
          alt="Restaurant service counter"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative z-10 flex min-h-screen flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-black">EatZone Merchant</div>
              <div className="text-sm text-white/65">merchant.eatzone.com</div>
            </div>
          </div>
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-red-200">
              សម្រាប់ម្ចាស់ហាង
            </p>
            <h1 className="text-5xl font-black leading-tight">
              Manage orders, menu stock, store hours, and payouts from one work screen.
            </h1>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { label: "Live orders", value: "Real-time" },
                { label: "Menu control", value: "Stock toggle" },
                { label: "Reports", value: "Net revenue" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="text-lg font-black">{item.value}</div>
                  <div className="mt-1 text-xs text-white/65">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500">
              <Store className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-black">EatZone Merchant</h1>
            <p className="mt-1 text-sm text-white/60">សម្រាប់ម្ចាស់ហាង</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
            <div className="mb-6">
              <p className="text-sm font-semibold text-red-200">Owner Login</p>
              <h2 className="mt-1 text-2xl font-black">ចូលគណនីម្ចាស់ហាង</h2>
              <p className="mt-2 text-sm text-white/55">
                Use the email and password created by the EatZone admin.
              </p>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-white/75">Email</span>
                <input
                  type="email"
                  defaultValue="malis@gmail.com"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-red-400"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-white/75">Password</span>
                <input
                  type="password"
                  defaultValue="merchant123"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-red-400"
                />
              </label>
              <button
                onClick={onLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-black text-white transition hover:bg-red-600"
              >
                <Store className="h-5 w-5" />
                Login to Dashboard
              </button>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-white/45">
            Path option: eatzone.com/merchant. Sub-domain option: merchant.eatzone.com.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof ShoppingBag;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onAccept,
  onReject,
  onReady,
  onComplete,
  now,
}: {
  order: MerchantOrder;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onReady: (id: string) => void;
  onComplete: (id: string) => void;
  now: number;
}) {
  const waitingStatus = getWaitingStatus(order.createdAt, now);
  const isLateNewOrder = order.stage === "new" && waitingStatus.isLate;

  return (
    <div
      className={`rounded-lg border bg-white p-4 shadow-sm ${
        isLateNewOrder
          ? "border-red-400 ring-2 ring-red-100"
          : order.isFresh
            ? "border-red-300 ring-2 ring-red-100 animate-pulse"
            : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-black text-slate-950">#{order.id}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{order.customerName}</span>
            <a
              href={`tel:${order.customerPhone.replace(/\s/g, "")}`}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-100"
              aria-label={`Call ${order.customerName}`}
              title={`Call ${order.customerName}`}
            >
              <Phone className="h-3.5 w-3.5" />
            </a>
            <span>{formatTime(order.createdAt)}</span>
          </div>
        </div>
        <div className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
          {formatCurrency(order.totalAmount)}
        </div>
      </div>

      {order.stage === "new" && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black ${
            isLateNewOrder ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>{waitingStatus.label}</span>
          {isLateNewOrder && <span className="ml-auto">Needs attention</span>}
        </div>
      )}

      <div className="my-3 space-y-1 rounded-lg bg-slate-50 p-3">
        {order.items.map((item) => (
          <div key={`${order.id}-${item.foodName}`} className="flex justify-between gap-3 text-sm">
            <span className="font-medium text-slate-800">
              {item.foodName} x{item.quantity}
            </span>
            <span className="text-slate-500">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-xs text-slate-500">
        <div>{order.deliveryAddress}</div>
        <div>{order.paymentMethod}</div>
        {order.note && <div className="font-medium text-amber-700">Note: {order.note}</div>}
      </div>

      {order.stage === "new" && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onAccept(order.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-black text-white hover:bg-emerald-600"
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept
          </button>
          <button
            onClick={() => onReject(order.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-black text-red-600 hover:bg-red-100"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      )}

      {order.stage === "preparing" && (
        <button
          onClick={() => onReady(order.id)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-black text-white hover:bg-orange-600"
        >
          <Bike className="h-4 w-4" />
          Ready for Pickup
        </button>
      )}

      {order.stage === "ready" && (
        <button
          onClick={() => onComplete(order.id)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-black text-white hover:bg-slate-800"
        >
          <PackageCheck className="h-4 w-4" />
          Mark Completed
        </button>
      )}
    </div>
  );
}

function OrdersBoard({
  orders,
  onAccept,
  onReject,
  onReady,
  onComplete,
  onSimulateNewOrder,
  now,
}: {
  orders: MerchantOrder[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onReady: (id: string) => void;
  onComplete: (id: string) => void;
  onSimulateNewOrder: () => void;
  now: number;
}) {
  const columns = [
    {
      id: "new" as const,
      title: "New Orders",
      khmer: "ការកុម្ម៉ង់ថ្មី",
      icon: Bell,
      tone: "text-red-600 bg-red-50",
      empty: "No new orders waiting.",
    },
    {
      id: "preparing" as const,
      title: "Preparing",
      khmer: "កំពុងចម្អិន",
      icon: ChefHat,
      tone: "text-orange-600 bg-orange-50",
      empty: "Accepted orders appear here.",
    },
    {
      id: "ready" as const,
      title: "Ready / Completed",
      khmer: "រួចរាល់",
      icon: PackageCheck,
      tone: "text-emerald-600 bg-emerald-50",
      empty: "Ready orders appear here.",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">Order Management Dashboard</p>
          <h1 className="text-2xl font-black text-slate-950">ផ្ទាំងគ្រប់គ្រងការបញ្ជាទិញ</h1>
          <p className="mt-1 text-sm text-slate-500">
            New orders flash on arrival and can trigger a browser sound after merchant interaction.
          </p>
        </div>
        <button
          onClick={onSimulateNewOrder}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800"
        >
          <Bell className="h-4 w-4" />
          Demo New Order
        </button>
      </div>

      {orders.some((order) => order.stage === "new" && order.isFresh) && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm font-semibold">New order received. Accept or reject it from the first column.</div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => {
          const columnOrders = orders.filter((order) => order.stage === column.id);
          return (
            <section key={column.id} className="min-h-[420px] rounded-lg border border-slate-200 bg-slate-100/70 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${column.tone}`}>
                    <column.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-black text-slate-950">{column.title}</div>
                    <div className="text-xs text-slate-500">{column.khmer}</div>
                  </div>
                </div>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-700">
                  {columnOrders.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnOrders.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-5 text-center text-sm text-slate-400">
                    {column.empty}
                  </div>
                )}
                {columnOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAccept={onAccept}
                    onReject={onReject}
                    onReady={onReady}
                    onComplete={onComplete}
                    now={now}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MenuManager({
  foods,
  onToggleStock,
  onDelete,
  onSave,
}: {
  foods: Food[];
  onToggleStock: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: (food: Food) => void;
}) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Food | null>(null);
  const [form, setForm] = useState<MenuFormData>(defaultForm);

  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(search.toLowerCase()));

  const openNewForm = () => {
    setEditing(null);
    setForm(defaultForm);
  };

  const openEditForm = (food: Food) => {
    setEditing(food);
    setForm({
      name: food.name,
      price: food.price.toString(),
      description: food.description,
      category: food.category,
      image: food.image,
    });
  };

  const handleImageFile = (file?: File) => {
    if (!file) return;
    setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price.trim()) return;

    onSave({
      id: editing?.id ?? `f${Date.now()}`,
      restaurantId: "r1",
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      category: form.category,
      image: form.image || "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
      isAvailable: editing?.isAvailable ?? true,
      rating: editing?.rating ?? 4.6,
      addons: editing?.addons,
    });

    setEditing(null);
    setForm(defaultForm);
  };

  const isFormOpen = editing !== null || form.name || form.price || form.description || form.image;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">Menu Item Management</p>
          <h1 className="text-2xl font-black text-slate-950">ការគ្រប់គ្រងម៉ឺនុយម្ហូប</h1>
          <p className="mt-1 text-sm text-slate-500">Add items, edit pricing, upload photos, and switch stock live.</p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-black text-white hover:bg-red-600"
        >
          <Plus className="h-4 w-4" />
          Add Food
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search menu items..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-300"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredFoods.map((food) => (
              <div key={food.id} className="grid gap-3 p-4 sm:grid-cols-[88px_1fr_auto] sm:items-center">
                <img src={food.image} alt={food.name} className="h-22 w-22 rounded-lg object-cover sm:h-[88px] sm:w-[88px]" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-950">{food.name}</h3>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                      {food.category}
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-bold ${
                        food.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {food.isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{food.description}</p>
                  <div className="mt-2 text-lg font-black text-red-600">{formatCurrency(food.price)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    onClick={() => onToggleStock(food.id)}
                    className="flex min-w-[134px] items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                    aria-label={`Toggle ${food.name} stock status`}
                  >
                    <span
                      className={`text-xs font-black ${
                        food.isAvailable ? "text-emerald-700" : "text-slate-500"
                      }`}
                    >
                      {food.isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                    <span
                      className={`relative h-6 w-11 rounded-full transition ${
                        food.isAvailable ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                          food.isAvailable ? "left-6" : "left-1"
                        }`}
                      />
                    </span>
                  </button>
                  <button
                    onClick={() => openEditForm(food)}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-black text-blue-700"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(food.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-black text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-950">{editing ? "Edit Food" : "Add Food"}</h2>
              <p className="text-xs text-slate-500">បន្ថែម/កែប្រែ មុខម្ហូប</p>
            </div>
            {isFormOpen && (
              <button
                onClick={() => {
                  setEditing(null);
                  setForm(defaultForm);
                }}
                className="rounded-lg bg-slate-100 p-2 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Image</span>
              <div className="grid grid-cols-[84px_1fr] gap-3">
                <img
                  src={form.image || "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop"}
                  alt="Food preview"
                  className="h-[84px] w-[84px] rounded-lg object-cover"
                />
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-center text-xs font-bold text-slate-500 hover:border-red-300">
                  <ImagePlus className="mb-1 h-5 w-5" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageFile(event.target.files?.[0])}
                  />
                </label>
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Food Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-red-300"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Price</span>
              <input
                type="number"
                min="0"
                step="0.25"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-red-300"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Category</span>
              <select
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as FoodCategory }))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-red-300"
              >
                {menuCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-red-300"
              />
            </label>
            <button
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save Food
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StoreSettings({
  isOpen,
  onToggleOpen,
}: {
  isOpen: boolean;
  onToggleOpen: () => void;
}) {
  const [promotions, setPromotions] = useState([
    { code: "MALIS15", discount: "15%", minOrder: "$8", active: true },
    { code: "LUNCH2", discount: "$2", minOrder: "$12", active: true },
  ]);
  const [promoCode, setPromoCode] = useState("");
  const [operatingHours, setOperatingHours] = useState([
    { day: "Mon", open: "09:00", close: "21:30" },
    { day: "Tue", open: "09:00", close: "21:30" },
    { day: "Wed", open: "09:00", close: "21:30" },
    { day: "Thu", open: "09:00", close: "21:30" },
    { day: "Fri", open: "09:00", close: "21:30" },
    { day: "Sat", open: "09:00", close: "21:30" },
    { day: "Sun", open: "09:00", close: "21:30" },
  ]);

  const updateOperatingHours = (day: string, field: "open" | "close", value: string) => {
    setOperatingHours((prev) =>
      prev.map((hours) => (hours.day === day ? { ...hours, [field]: value } : hours)),
    );
  };

  const applyMondayHoursToAllDays = () => {
    const monday = operatingHours[0];
    setOperatingHours((prev) =>
      prev.map((hours) => ({ ...hours, open: monday.open, close: monday.close })),
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-red-600">Store Settings</p>
        <h1 className="text-2xl font-black text-slate-950">ការគ្រប់គ្រងហាងទូទៅ</h1>
        <p className="mt-1 text-sm text-slate-500">Control store availability, operating hours, and promotions.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-black text-slate-950">Open / Close Store</h2>
              <p className="mt-1 text-sm text-slate-500">បិទ/បើកហាង for customer ordering.</p>
            </div>
            <button
              onClick={onToggleOpen}
              className={`relative h-8 w-14 rounded-full transition ${isOpen ? "bg-emerald-500" : "bg-slate-300"}`}
              aria-label="Toggle store open status"
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                  isOpen ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
          <div className={`mt-4 rounded-lg p-3 text-sm font-bold ${isOpen ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {isOpen ? "Store is accepting orders" : "Store is closed"}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-red-500" />
              <h2 className="font-black text-slate-950">Operating Hours</h2>
            </div>
            <button
              onClick={applyMondayHoursToAllDays}
              className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white hover:bg-slate-800"
            >
              Apply to all days
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {operatingHours.map((hours) => (
              <div key={hours.day} className="grid grid-cols-[48px_1fr_1fr] items-center gap-2">
                <div className="text-sm font-black text-slate-700">{hours.day}</div>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(event) => updateOperatingHours(hours.day, "open", event.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
                <input
                  type="time"
                  value={hours.close}
                  onChange={(event) => updateOperatingHours(hours.day, "close", event.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-red-500" />
          <div>
            <h2 className="font-black text-slate-950">Promotions</h2>
            <p className="text-xs text-slate-500">ការរៀបចំប្រូម៉ូសិន</p>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-[1fr_160px_160px_auto]">
          <input
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
            placeholder="Promo code"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-red-300"
          />
          <input defaultValue="10%" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-red-300" />
          <input defaultValue="$10 min" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-red-300" />
          <button
            onClick={() => {
              if (!promoCode.trim()) return;
              setPromotions((prev) => [
                { code: promoCode.trim(), discount: "10%", minOrder: "$10", active: true },
                ...prev,
              ]);
              setPromoCode("");
            }}
            className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-black text-white hover:bg-red-600"
          >
            Create
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {promotions.map((promo) => (
            <div key={promo.code} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <div className="font-black text-slate-950">{promo.code}</div>
                <div className="text-sm text-slate-500">
                  {promo.discount} off · min {promo.minOrder}
                </div>
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                {promo.active ? "Active" : "Paused"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportsAnalytics({
  totalOrders,
  totalRevenue,
}: {
  totalOrders: number;
  totalRevenue: number;
}) {
  const commissionRate = 0.18;
  const commission = totalRevenue * commissionRate;
  const netPayout = totalRevenue - commission;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-red-600">Reports & Analytics</p>
        <h1 className="text-2xl font-black text-slate-950">របាយការណ៍ និងការលក់</h1>
        <p className="mt-1 text-sm text-slate-500">Daily order volume, total revenue, commission, and payout estimate.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Today's Orders" value={totalOrders.toString()} icon={ShoppingBag} tone="bg-red-50 text-red-600" />
        <StatTile label="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} tone="bg-emerald-50 text-emerald-600" />
        <StatTile label="Commission" value={formatCurrency(commission)} icon={Eye} tone="bg-amber-50 text-amber-600" />
        <StatTile label="Net Payout" value={formatCurrency(netPayout)} icon={PackageCheck} tone="bg-blue-50 text-blue-600" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-slate-950">Weekly Revenue</h2>
            <p className="text-xs text-slate-500">Last 7 days</p>
          </div>
          <div className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">18% commission</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="merchantRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
              formatter={(value: number, name: string) => [name === "revenue" ? formatCurrency(value) : value, name]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} fill="url(#merchantRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export function MerchantPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<MerchantView>("orders");
  const [isOpen, setIsOpen] = useState(true);
  const [orders, setOrders] = useState<MerchantOrder[]>(seedOrders);
  const [foods, setFoods] = useState<Food[]>(initialFoods.filter((food) => food.restaurantId === "r1"));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const metrics = useMemo(() => {
    const activeOrders = orders.filter((order) => order.stage !== "rejected");
    const totalRevenue = activeOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      newOrders: orders.filter((order) => order.stage === "new").length,
      preparingOrders: orders.filter((order) => order.stage === "preparing").length,
      totalOrders: activeOrders.length,
      totalRevenue,
    };
  }, [orders]);

  const updateOrderStage = (id: string, stage: MerchantOrderStage) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, stage, isFresh: false } : order)),
    );
  };

  const addDemoOrder = () => {
    playAlertTone();
    const demoOrder: MerchantOrder = {
      id: `ORD${Math.floor(100 + Math.random() * 900)}`,
      customerName: "New Customer",
      customerPhone: "012 444 555",
      items: [
        { foodName: "Lok Lak", quantity: 1, price: 7 },
        { foodName: "Amok Fish", quantity: 1, price: 6.5 },
      ],
      stage: "new",
      totalAmount: 13.5,
      deliveryFee: 1.5,
      deliveryAddress: "Toul Kork, Phnom Penh",
      paymentMethod: "ABA",
      createdAt: new Date().toISOString(),
      note: "Please call when rider arrives",
      isFresh: true,
    };

    setOrders((prev) => [demoOrder, ...prev]);
  };

  const saveFood = (food: Food) => {
    setFoods((prev) => {
      const exists = prev.some((item) => item.id === food.id);
      return exists ? prev.map((item) => (item.id === food.id ? food : item)) : [food, ...prev];
    });
  };

  if (!isAuthenticated) {
    return <MerchantLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500 text-white">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <div className="font-black">Malis Restaurant</div>
              <div className={`text-xs font-bold ${isOpen ? "text-emerald-600" : "text-slate-400"}`}>
                {isOpen ? "Open" : "Closed"}
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                  isActive ? "bg-red-50 text-red-600" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>
                  <span className="block text-sm font-black">{item.label}</span>
                  <span className="block text-xs text-current/65">{item.khmer}</span>
                </span>
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="m-3 flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-black text-slate-500 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500 text-white">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-black">EatZone Merchant</div>
                  <div className="text-xs text-slate-500">សម្រាប់ម្ចាស់ហាង</div>
                </div>
              </div>
              <button onClick={() => setIsAuthenticated(false)} className="rounded-lg bg-slate-100 p-2 text-slate-500">
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            <div className="hidden lg:block">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Merchant Dashboard</div>
              <div className="text-sm text-slate-500">Path: /merchant · Sub-domain ready: merchant.eatzone.com</div>
            </div>

            <div className="grid grid-cols-3 gap-2 lg:w-[520px]">
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="text-xs text-slate-500">New</div>
                <div className="font-black text-red-600">{metrics.newOrders}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="text-xs text-slate-500">Preparing</div>
                <div className="font-black text-orange-600">{metrics.preparingOrders}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="text-xs text-slate-500">Revenue</div>
                <div className="font-black text-emerald-600">{formatCurrency(metrics.totalRevenue)}</div>
              </div>
            </div>
          </div>

          <nav className="flex overflow-x-auto border-t border-slate-100 bg-white px-2 lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex min-w-[92px] flex-1 flex-col items-center gap-1 px-2 py-2 text-xs font-black ${
                  activeView === item.id ? "text-red-600" : "text-slate-400"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="p-4 lg:p-6">
          {activeView === "orders" && (
            <OrdersBoard
              orders={orders}
              onAccept={(id) => updateOrderStage(id, "preparing")}
              onReject={(id) => updateOrderStage(id, "rejected")}
              onReady={(id) => updateOrderStage(id, "ready")}
              onComplete={(id) => updateOrderStage(id, "ready")}
              onSimulateNewOrder={addDemoOrder}
              now={now}
            />
          )}
          {activeView === "menu" && (
            <MenuManager
              foods={foods}
              onToggleStock={(id) =>
                setFoods((prev) => prev.map((food) => (food.id === id ? { ...food, isAvailable: !food.isAvailable } : food)))
              }
              onDelete={(id) => setFoods((prev) => prev.filter((food) => food.id !== id))}
              onSave={saveFood}
            />
          )}
          {activeView === "settings" && <StoreSettings isOpen={isOpen} onToggleOpen={() => setIsOpen((prev) => !prev)} />}
          {activeView === "reports" && (
            <ReportsAnalytics
              totalOrders={metrics.totalOrders}
              totalRevenue={metrics.totalRevenue}
            />
          )}
        </div>
      </main>
    </div>
  );
}
