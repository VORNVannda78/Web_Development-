import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bike,
  Camera,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  MessageCircle,
  Moon,
  Navigation,
  Package,
  Phone,
  Power,
  Radio,
  Route,
  ShieldAlert,
  Store,
  Sun,
  User,
  Volume2,
  Wallet,
} from "lucide-react";

type DeliveryStage = "idle" | "to-store" | "verify-pickup" | "to-customer" | "completed";

interface RiderJob {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  distanceKm: number;
  earning: number;
  orderTotal: number;
  paymentMethod: "Cash On Delivery" | "ABA" | "KHQR";
  items: Array<{ name: string; quantity: number }>;
}

const incomingJob: RiderJob = {
  id: "ORD041",
  restaurantName: "Malis Restaurant",
  restaurantAddress: "136 Norodom Blvd, Phnom Penh",
  customerName: "Sophea Mao",
  customerPhone: "012 100 200",
  customerAddress: "House 12, Street 271, BKK1, Phnom Penh",
  distanceKm: 4.8,
  earning: 2.75,
  orderTotal: 18.5,
  paymentMethod: "Cash On Delivery",
  items: [
    { name: "Amok Fish", quantity: 1 },
    { name: "Lok Lak", quantity: 2 },
  ],
};

const completedDeliveries = [
  { id: "ORD031", earning: 2.5, cashCollected: 0, distance: 3.2 },
  { id: "ORD034", earning: 3.0, cashCollected: 22.0, distance: 5.4 },
  { id: "ORD038", earning: 2.25, cashCollected: 15.5, distance: 2.9 },
];

const CASH_REMIT_LIMIT = 50;
const baseCashToRemit = completedDeliveries.reduce((sum, delivery) => sum + delivery.cashCollected, 0);
const baseDailyEarnings = completedDeliveries.reduce((sum, delivery) => sum + delivery.earning, 0);

function playLoudPing() {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (AudioContextConstructor) {
    const context = new AudioContextConstructor();
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.85);
    gain.connect(context.destination);

    [0, 0.22, 0.44].forEach((offset) => {
      const oscillator = context.createOscillator();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(920, context.currentTime + offset);
      oscillator.connect(gain);
      oscillator.start(context.currentTime + offset);
      oscillator.stop(context.currentTime + offset + 0.14);
    });
  }

  navigator.vibrate?.([280, 90, 280, 90, 380]);
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function openMaps(destination: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function BigMetric({
  label,
  value,
  icon: Icon,
  darkMode,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  darkMode: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 ${darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-950"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-500"}`}>{label}</div>
          <div className="mt-1 text-3xl font-black">{value}</div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? "bg-amber-400 text-slate-950" : "bg-amber-100 text-amber-700"}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function SwipeToAccept({ onAccept, darkMode }: { onAccept: () => void; darkMode: boolean }) {
  const [value, setValue] = useState(0);

  const handleChange = (nextValue: number) => {
    setValue(nextValue);
    if (nextValue >= 96) {
      setValue(0);
      onAccept();
    }
  };

  return (
    <div className={`rounded-2xl p-4 ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}>
      <div className="mb-3 flex items-center justify-between text-sm font-black">
        <span>Swipe to Accept</span>
        <ArrowRight className="h-5 w-5" />
      </div>
      <div className="relative h-16 overflow-hidden rounded-2xl bg-emerald-500">
        <div className="absolute inset-y-0 left-0 bg-emerald-300/70" style={{ width: `${value}%` }} />
        <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
          អូសដើម្បីទទួល
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(event) => handleChange(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-grab opacity-0"
          aria-label="Swipe to accept delivery"
        />
      </div>
    </div>
  );
}

function IncomingOrderModal({
  job,
  darkMode,
  onAccept,
  onReject,
}: {
  job: RiderJob;
  darkMode: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/75 p-3 sm:items-center sm:justify-center">
      <div className={`w-full max-w-lg rounded-3xl p-5 shadow-2xl ${darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-950"}`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
              <Volume2 className="h-8 w-8" />
            </div>
            <div>
              <div className="text-sm font-black uppercase tracking-wide text-amber-500">Incoming Order</div>
              <div className="text-3xl font-black">#{job.id}</div>
            </div>
          </div>
          <button
            onClick={onReject}
            className={`rounded-2xl px-4 py-3 text-base font-black ${darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"}`}
          >
            Skip
          </button>
        </div>

        <div className="grid gap-3">
          <div className={`rounded-2xl p-4 ${darkMode ? "bg-slate-900" : "bg-amber-50"}`}>
            <div className="mb-1 flex items-center gap-2 text-sm font-black text-amber-600">
              <Store className="h-5 w-5" />
              Pickup
            </div>
            <div className="text-xl font-black">{job.restaurantName}</div>
            <div className={`mt-1 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{job.restaurantAddress}</div>
          </div>

          <div className={`rounded-2xl p-4 ${darkMode ? "bg-slate-900" : "bg-emerald-50"}`}>
            <div className="mb-1 flex items-center gap-2 text-sm font-black text-emerald-600">
              <MapPin className="h-5 w-5" />
              Drop-off
            </div>
            <div className="text-xl font-black">{job.customerName}</div>
            <div className={`mt-1 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{job.customerAddress}</div>
          </div>
        </div>

        <div className="my-4 grid grid-cols-2 gap-3">
          <div className={`rounded-2xl p-4 text-center ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}>
            <Route className="mx-auto mb-1 h-6 w-6 text-blue-500" />
            <div className="text-3xl font-black">{job.distanceKm.toFixed(1)}</div>
            <div className="text-sm font-bold text-slate-500">km total</div>
          </div>
          <div className={`rounded-2xl p-4 text-center ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}>
            <DollarSign className="mx-auto mb-1 h-6 w-6 text-emerald-500" />
            <div className="text-3xl font-black">{formatCurrency(job.earning)}</div>
            <div className="text-sm font-bold text-slate-500">earning</div>
          </div>
        </div>

        <SwipeToAccept darkMode={darkMode} onAccept={onAccept} />
      </div>
    </div>
  );
}

function RoutePreview({ title, address, tone }: { title: string; address: string; tone: "pickup" | "dropoff" }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-5 text-white">
      <div className="absolute inset-0 opacity-35">
        <div className="absolute left-8 top-6 h-24 w-24 rounded-full border-8 border-amber-400" />
        <div className="absolute right-10 top-12 h-32 w-32 rounded-full border-8 border-emerald-400" />
        <div className="absolute bottom-8 left-12 right-12 h-2 rotate-[-16deg] rounded-full bg-white" />
        <div className="absolute bottom-20 left-16 right-8 h-2 rotate-[18deg] rounded-full bg-white" />
      </div>
      <div className="relative z-10">
        <div className="mb-16 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
          {tone === "pickup" ? <Store className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
        </div>
        <div className="text-sm font-black uppercase tracking-wide text-white/70">{title}</div>
        <div className="mt-1 text-xl font-black">{address}</div>
      </div>
    </div>
  );
}

function ActiveDeliveryFlow({
  job,
  stage,
  darkMode,
  onStageChange,
}: {
  job: RiderJob;
  stage: DeliveryStage;
  darkMode: boolean;
  onStageChange: (stage: DeliveryStage) => void;
}) {
  const [pickupProof, setPickupProof] = useState(false);
  const [deliveryProof, setDeliveryProof] = useState(false);

  if (stage === "to-store") {
    return (
      <section className="space-y-4">
        <RoutePreview title="Stage 1: Go to Store" address={job.restaurantAddress} tone="pickup" />
        <div className={`rounded-3xl p-4 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
          <div className="mb-4 flex items-center gap-3">
            <Store className="h-7 w-7 text-amber-500" />
            <div>
              <div className="text-2xl font-black">{job.restaurantName}</div>
              <div className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-500"}`}>Pickup food from restaurant</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => openMaps(job.restaurantAddress)}
              className="flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-lg font-black text-white"
            >
              <Navigation className="h-6 w-6" />
              Navigate
            </button>
            <button
              onClick={() => onStageChange("verify-pickup")}
              className="flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-lg font-black text-white"
            >
              <CheckCircle className="h-6 w-6" />
              Arrived
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "verify-pickup") {
    return (
      <section className={`rounded-3xl p-5 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
        <div className="mb-4 text-center">
          <div className={`text-sm font-black uppercase tracking-wide ${darkMode ? "text-slate-300" : "text-slate-500"}`}>Stage 2: Verify Food</div>
          <div className="mt-2 text-6xl font-black tracking-tight text-amber-500">#{job.id}</div>
          <div className={`mt-2 text-base font-bold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Show this order number to the merchant.</div>
        </div>

        <div className={`mb-4 rounded-2xl p-4 ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}>
          <div className="mb-2 text-sm font-black">Order Items</div>
          {job.items.map((item) => (
            <div key={item.name} className="flex justify-between py-1 text-lg font-bold">
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
            </div>
          ))}
        </div>

        <label className={`mb-3 flex min-h-20 cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-lg font-black ${pickupProof ? "border-emerald-400 bg-emerald-50 text-emerald-700" : darkMode ? "border-slate-600 bg-slate-900 text-slate-200" : "border-slate-300 bg-slate-50 text-slate-600"}`}>
          <Camera className="h-7 w-7" />
          {pickupProof ? "Pickup proof added" : "Proof of Pickup"}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => setPickupProof(true)} />
        </label>

        <button
          onClick={() => onStageChange("to-customer")}
          disabled={!pickupProof}
          className="flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-xl font-black text-white disabled:bg-slate-300 disabled:text-slate-500"
        >
          <Package className="h-7 w-7" />
          Picked Up
        </button>
      </section>
    );
  }

  if (stage === "to-customer") {
    return (
      <section className="space-y-4">
        <RoutePreview title="Stage 3: Go to Customer" address={job.customerAddress} tone="dropoff" />
        <div className={`rounded-3xl p-4 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
          <div className="mb-4 flex items-center gap-3">
            <User className="h-7 w-7 text-emerald-500" />
            <div>
              <div className="text-2xl font-black">{job.customerName}</div>
              <div className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-500"}`}>{job.customerAddress}</div>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-3 gap-2">
            <button
              onClick={() => openMaps(job.customerAddress)}
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl bg-blue-600 text-sm font-black text-white"
            >
              <Navigation className="h-6 w-6" />
              Navigate
            </button>
            <a
              href={`tel:${job.customerPhone.replace(/\s/g, "")}`}
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl bg-emerald-500 text-sm font-black text-white"
            >
              <Phone className="h-6 w-6" />
              Call
            </a>
            <button className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl bg-slate-900 text-sm font-black text-white">
              <MessageCircle className="h-6 w-6" />
              Chat
            </button>
          </div>

          <label className={`mb-3 flex min-h-20 cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-lg font-black ${deliveryProof ? "border-emerald-400 bg-emerald-50 text-emerald-700" : darkMode ? "border-slate-600 bg-slate-900 text-slate-200" : "border-slate-300 bg-slate-50 text-slate-600"}`}>
            <Camera className="h-7 w-7" />
            {deliveryProof ? "Delivery proof added" : "Proof of Delivery"}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => setDeliveryProof(true)} />
          </label>

          <button
            onClick={() => onStageChange("completed")}
            disabled={!deliveryProof}
            className="flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-xl font-black text-white disabled:bg-slate-300 disabled:text-slate-500"
          >
            <CheckCircle className="h-7 w-7" />
            Delivered
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`rounded-3xl p-8 text-center ${darkMode ? "bg-slate-800" : "bg-white"}`}>
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
        <CheckCircle className="h-11 w-11" />
      </div>
      <div className="text-3xl font-black">Delivery Completed</div>
      <div className={`mt-2 text-base font-bold ${darkMode ? "text-slate-300" : "text-slate-500"}`}>You earned {formatCurrency(job.earning)} from this trip.</div>
      <button
        onClick={() => onStageChange("idle")}
        className="mt-6 min-h-16 w-full rounded-2xl bg-amber-400 text-xl font-black text-slate-950"
      >
        Back to Home
      </button>
    </section>
  );
}

function CurrentLocationMap({
  darkMode,
  isOnline,
  canReceiveOrders,
  onRequestJob,
}: {
  darkMode: boolean;
  isOnline: boolean;
  canReceiveOrders: boolean;
  onRequestJob: () => void;
}) {
  return (
    <section className={`overflow-hidden rounded-3xl ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <div className="text-sm font-black uppercase tracking-wide text-amber-500">Current Location Map</div>
          <div className="text-2xl font-black">Hot Zones Nearby</div>
        </div>
        <div className={`rounded-2xl px-3 py-2 text-sm font-black ${isOnline ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
          {isOnline ? "Live" : "Offline"}
        </div>
      </div>

      <div className="relative mx-4 h-72 overflow-hidden rounded-3xl bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute left-0 top-10 h-1 w-full rotate-[-10deg] bg-white" />
          <div className="absolute left-0 top-32 h-1 w-full rotate-[16deg] bg-white" />
          <div className="absolute left-0 top-52 h-1 w-full rotate-[-3deg] bg-white" />
          <div className="absolute left-12 top-0 h-full w-1 rotate-[8deg] bg-white" />
          <div className="absolute right-24 top-0 h-full w-1 rotate-[-14deg] bg-white" />
          <div className="absolute right-8 top-0 h-full w-1 rotate-[4deg] bg-white" />
        </div>

        {[
          { name: "BKK1", size: "h-28 w-28", position: "left-8 top-8", orders: "12 orders" },
          { name: "Riverside", size: "h-24 w-24", position: "right-8 top-14", orders: "9 orders" },
          { name: "Aeon", size: "h-20 w-20", position: "left-32 bottom-10", orders: "7 orders" },
        ].map((zone) => (
          <div key={zone.name} className={`absolute ${zone.position}`}>
            <div className={`${zone.size} animate-pulse rounded-full bg-red-500/45 ring-4 ring-red-400/40`} />
            <div className="absolute left-1/2 top-1/2 min-w-20 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-red-600 px-2 py-1 text-center text-xs font-black shadow-lg">
              {zone.name}
              <span className="block text-[10px] text-red-100">{zone.orders}</span>
            </div>
          </div>
        ))}

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white ring-8 ring-blue-400/30">
            <Navigation className="h-7 w-7" />
          </div>
          <div className="mt-2 rounded-xl bg-white px-3 py-1 text-sm font-black text-slate-950 shadow-lg">You</div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-black/60 p-3 backdrop-blur">
            <div className="text-xs font-bold text-white/60">Current area</div>
            <div className="text-lg font-black">Toul Kork</div>
          </div>
          <div className="rounded-2xl bg-black/60 p-3 backdrop-blur">
            <div className="text-xs font-bold text-white/60">Nearest hot zone</div>
            <div className="text-lg font-black">2.1 km</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={onRequestJob}
          disabled={!isOnline || !canReceiveOrders}
          className="flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 text-xl font-black text-slate-950 disabled:bg-slate-300 disabled:text-slate-500"
        >
          <Volume2 className="h-7 w-7" />
          Demo Incoming Order
        </button>
        {!canReceiveOrders && (
          <div className="mt-3 rounded-2xl bg-red-600 p-3 text-center text-sm font-black text-white">
            Blocked until KHQR remittance is completed
          </div>
        )}
      </div>
    </section>
  );
}

function WalletPanel({
  darkMode,
  cashToRemit,
  dailyEarnings,
  ordersToday,
  onPayKhqr,
}: {
  darkMode: boolean;
  cashToRemit: number;
  dailyEarnings: number;
  ordersToday: number;
  onPayKhqr: () => void;
}) {
  const isBlocked = cashToRemit >= CASH_REMIT_LIMIT;

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <BigMetric label="Daily Earnings" value={formatCurrency(dailyEarnings)} icon={DollarSign} darkMode={darkMode} />
        <BigMetric label="Orders Today" value={`${ordersToday}`} icon={Package} darkMode={darkMode} />
      </div>

      <div className={`rounded-3xl p-5 ${isBlocked ? "bg-red-600 text-white" : darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-950"}`}>
        <div className="mb-3 flex items-center gap-3">
          <Wallet className="h-8 w-8" />
          <div>
            <div className="text-2xl font-black">Cash to Remit</div>
            <div className={isBlocked ? "text-red-100" : darkMode ? "text-slate-300" : "text-slate-500"}>
              សាច់ប្រាក់ត្រូវប្រគល់ឱ្យក្រុមហ៊ុន
            </div>
          </div>
        </div>
        <div className="text-5xl font-black">{formatCurrency(cashToRemit)}</div>
        <div className={isBlocked ? "mt-1 text-sm font-bold text-red-100" : darkMode ? "mt-1 text-sm font-bold text-slate-300" : "mt-1 text-sm font-bold text-slate-500"}>
          Limit: {formatCurrency(CASH_REMIT_LIMIT)}
        </div>
        <div className={`mt-3 rounded-2xl p-3 text-base font-black ${isBlocked ? "bg-white text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
          {isBlocked ? "Blocked: remit cash before accepting more orders" : "Cash balance is within safe limit"}
        </div>
        <button
          onClick={onPayKhqr}
          disabled={cashToRemit <= 0}
          className={`mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-black disabled:bg-slate-300 disabled:text-slate-500 ${isBlocked ? "bg-slate-950 text-white" : "bg-amber-400 text-slate-950"}`}
        >
          <CreditCard className="h-6 w-6" />
          Pay via KHQR
        </button>
      </div>
    </section>
  );
}

export function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showIncoming, setShowIncoming] = useState(false);
  const [activeJob, setActiveJob] = useState<RiderJob | undefined>();
  const [stage, setStage] = useState<DeliveryStage>("idle");
  const [extraCashCollected, setExtraCashCollected] = useState(0);
  const [extraEarnings, setExtraEarnings] = useState(0);
  const [extraOrders, setExtraOrders] = useState(0);
  const [remittedCash, setRemittedCash] = useState(0);

  const cashToRemit = Math.max(0, baseCashToRemit + extraCashCollected - remittedCash);
  const canReceiveOrders = cashToRemit < CASH_REMIT_LIMIT;
  const dailyEarnings = baseDailyEarnings + extraEarnings + (activeJob && stage !== "completed" ? activeJob.earning : 0);
  const ordersToday = completedDeliveries.length + extraOrders + (activeJob && stage !== "completed" ? 1 : 0);

  const requestJob = () => {
    if (!isOnline || !canReceiveOrders || activeJob) return;
    playLoudPing();
    setShowIncoming(true);
  };

  const acceptJob = () => {
    setActiveJob(incomingJob);
    setStage("to-store");
    setShowIncoming(false);
  };

  const finishFlow = (nextStage: DeliveryStage) => {
    if (nextStage === "completed" && activeJob && stage !== "completed") {
      setExtraEarnings((value) => value + activeJob.earning);
      setExtraOrders((value) => value + 1);
      if (activeJob.paymentMethod === "Cash On Delivery") {
        setExtraCashCollected((value) => value + activeJob.orderTotal);
      }
    }
    setStage(nextStage);
    if (nextStage === "idle") {
      setActiveJob(undefined);
    }
  };

  return (
    <div className={`${darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-950"} min-h-[calc(100vh-128px)] pb-5`}>
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        <section className={`rounded-3xl p-4 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-500">
                <Radio className="h-4 w-4" />
                Rider App
              </div>
              <h1 className="mt-1 text-3xl font-black">Dara Sok</h1>
              <p className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-500"}`}>ធំ ច្បាស់ លឿន សម្រាប់អ្នកដឹកជញ្ជូន</p>
            </div>
            <button
              onClick={() => setDarkMode((value) => !value)}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${darkMode ? "bg-slate-800 text-amber-300" : "bg-slate-100 text-slate-700"}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-7 w-7" /> : <Moon className="h-7 w-7" />}
            </button>
          </div>

          <button
            onClick={() => setIsOnline((value) => !value)}
            className={`flex min-h-24 w-full items-center justify-between rounded-3xl px-5 text-left transition ${
              isOnline ? "bg-emerald-500 text-white" : darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"
            }`}
          >
            <span>
              <span className="block text-4xl font-black">{isOnline ? "ONLINE" : "OFFLINE"}</span>
              <span className="block text-base font-bold opacity-85">{isOnline ? "Ready to receive jobs" : "Taking a break"}</span>
            </span>
            <Power className="h-12 w-12" />
          </button>
        </section>

        {!canReceiveOrders && (
          <div className="flex items-start gap-3 rounded-3xl bg-red-600 p-4 text-white">
            <ShieldAlert className="h-8 w-8 flex-shrink-0" />
            <div>
              <div className="text-xl font-black">Cash limit reached</div>
              <div className="font-semibold text-red-100">
                Cash to remit is {formatCurrency(cashToRemit)}. Pay via KHQR before receiving new jobs.
              </div>
            </div>
          </div>
        )}

        {stage === "idle" && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <BigMetric label="Today" value="$7.75" icon={DollarSign} darkMode={darkMode} />
              <BigMetric label="Trips" value="3" icon={Bike} darkMode={darkMode} />
              <BigMetric label="Online" value={isOnline ? "Yes" : "No"} icon={Clock} darkMode={darkMode} />
            </div>

            <CurrentLocationMap
              darkMode={darkMode}
              isOnline={isOnline}
              canReceiveOrders={canReceiveOrders}
              onRequestJob={requestJob}
            />
          </>
        )}

        {activeJob && stage !== "idle" && (
          <ActiveDeliveryFlow job={activeJob} stage={stage} darkMode={darkMode} onStageChange={finishFlow} />
        )}

        <WalletPanel
          darkMode={darkMode}
          cashToRemit={cashToRemit}
          dailyEarnings={dailyEarnings}
          ordersToday={ordersToday}
          onPayKhqr={() => setRemittedCash(baseCashToRemit + extraCashCollected)}
        />

        <section className={`rounded-3xl p-4 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-black">Rider UX Rules</h2>
          </div>
          <div className={`grid gap-2 text-base font-bold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            <div>High contrast colors for sunlight.</div>
            <div>Large buttons for glove and one-hand use.</div>
            <div>Night mode for safer evening delivery.</div>
          </div>
        </section>
      </div>

      {showIncoming && (
        <IncomingOrderModal
          job={incomingJob}
          darkMode={darkMode}
          onAccept={acceptJob}
          onReject={() => setShowIncoming(false)}
        />
      )}
    </div>
  );
}
