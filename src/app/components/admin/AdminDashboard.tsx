import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bike,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileCheck,
  Gift,
  ImagePlus,
  MapPin,
  Megaphone,
  Percent,
  RefreshCcw,
  Search,
  Shield,
  ShoppingBag,
  Store,
  Truck,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { orders, restaurants, riders, users } from "../../data/mockData";

type AdminView = "overview" | "accounts" | "live" | "finance" | "marketing";

interface ApprovalRequest {
  id: string;
  name: string;
  type: "Merchant" | "Rider";
  phone: string;
  submittedAt: string;
  documents: string[];
  risk: "Low" | "Medium" | "High";
  status: "Pending" | "Approved" | "Rejected";
}

interface LiveOrder {
  id: string;
  merchant: string;
  rider: string;
  customer: string;
  status: "Preparing" | "Rider Picking" | "Delivering" | "Delayed" | "Issue";
  eta: string;
  value: number;
  location: string;
}

interface PayoutItem {
  id: string;
  recipient: string;
  role: "Merchant" | "Rider";
  amount: number;
  method: "ABA" | "KHQR" | "Bank";
  status: "Pending" | "Paid";
}

interface CommissionRule {
  id: string;
  merchant: string;
  rate: number;
}

const adminViews = [
  { id: "overview" as const, label: "Overview", khmer: "ទិន្នន័យរួម", icon: BarChart3 },
  { id: "accounts" as const, label: "Users & KYC", khmer: "គ្រប់គ្រងគណនី", icon: Users },
  { id: "live" as const, label: "God View", khmer: "តាមដាន Order", icon: MapPin },
  { id: "finance" as const, label: "Finance", khmer: "ហិរញ្ញវត្ថុ", icon: DollarSign },
  { id: "marketing" as const, label: "Marketing", khmer: "ទីផ្សារ", icon: Megaphone },
];

const volumeData = [
  { day: "Mon", gmv: 4200, commission: 756, orders: 310 },
  { day: "Tue", gmv: 5180, commission: 932, orders: 384 },
  { day: "Wed", gmv: 4890, commission: 880, orders: 361 },
  { day: "Thu", gmv: 6420, commission: 1156, orders: 472 },
  { day: "Fri", gmv: 7010, commission: 1262, orders: 518 },
  { day: "Sat", gmv: 8340, commission: 1501, orders: 628 },
  { day: "Sun", gmv: 7790, commission: 1402, orders: 590 },
];

const initialApprovals: ApprovalRequest[] = [
  {
    id: "KYC-1024",
    name: "Kroeung Kitchen",
    type: "Merchant",
    phone: "012 999 888",
    submittedAt: "Today, 09:12",
    documents: ["Business license", "Owner ID", "Bank account"],
    risk: "Low",
    status: "Pending",
  },
  {
    id: "KYC-1025",
    name: "Sokha Vann",
    type: "Rider",
    phone: "086 222 111",
    submittedAt: "Today, 10:40",
    documents: ["National ID", "Driver license", "Motorbike card"],
    risk: "Medium",
    status: "Pending",
  },
  {
    id: "KYC-1026",
    name: "Sunset Sushi",
    type: "Merchant",
    phone: "012 777 666",
    submittedAt: "Yesterday, 16:02",
    documents: ["Business license", "Owner ID"],
    risk: "Low",
    status: "Pending",
  },
];

const initialLiveOrders: LiveOrder[] = [
  {
    id: "ORD401",
    merchant: "Malis Restaurant",
    rider: "Dara Sok",
    customer: "Sophea Mao",
    status: "Delivering",
    eta: "8 min",
    value: 22.5,
    location: "BKK1",
  },
  {
    id: "ORD402",
    merchant: "KFC Cambodia",
    rider: "Virak Pich",
    customer: "Borey Chan",
    status: "Delayed",
    eta: "24 min",
    value: 24,
    location: "Toul Kork",
  },
  {
    id: "ORD403",
    merchant: "Pizza Company",
    rider: "Unassigned",
    customer: "Chantha Roeun",
    status: "Issue",
    eta: "Needs action",
    value: 31,
    location: "Daun Penh",
  },
];

const initialPayouts: PayoutItem[] = [
  { id: "PAY-901", recipient: "Malis Restaurant", role: "Merchant", amount: 500, method: "ABA", status: "Pending" },
  { id: "PAY-902", recipient: "KFC Cambodia", role: "Merchant", amount: 840, method: "Bank", status: "Pending" },
  { id: "PAY-903", recipient: "Dara Sok", role: "Rider", amount: 50, method: "KHQR", status: "Pending" },
  { id: "PAY-904", recipient: "Virak Pich", role: "Rider", amount: 42, method: "KHQR", status: "Paid" },
];

const initialCommissionRules: CommissionRule[] = [
  { id: "r1", merchant: "Malis Restaurant", rate: 18 },
  { id: "r2", merchant: "KFC Cambodia", rate: 15 },
  { id: "r4", merchant: "Pizza Company", rate: 18 },
];

const refundQueue = [
  { id: "REF-201", orderId: "ORD302", customer: "Sophea Mao", amount: 12.5, reason: "Missing item" },
  { id: "REF-202", orderId: "ORD318", customer: "Borey Chan", amount: 8.75, reason: "Late delivery" },
];

const initialBanners = [
  { id: "BN-01", title: "Khmer New Year 50%", placement: "Customer Home", status: "Live" },
  { id: "BN-02", title: "Free Delivery Weekend", placement: "Checkout", status: "Scheduled" },
];

const initialPromos = [
  { code: "KHMERNEWYEAR", discount: "50%", budget: 1200, owner: "EatZone" },
  { code: "EATZONE5", discount: "$5", budget: 500, owner: "EatZone" },
];

function money(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Paid" || status === "Approved" || status === "Live"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Rejected" || status === "Issue" || status === "Delayed"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-amber-50 text-amber-700 border-amber-200";

  return <span className={`rounded-md border px-2 py-1 text-xs font-black ${tone}`}>{status}</span>;
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Store;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-500">{label}</div>
          <div className="mt-1 text-3xl font-black text-slate-950">{value}</div>
          <div className="mt-2 text-xs font-bold text-slate-400">{sub}</div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function AdminMap({ liveOrders }: { liveOrders: LiveOrder[] }) {
  const riderPins = [
    { name: "Dara", left: "28%", top: "34%", status: "Delivering" },
    { name: "Virak", left: "62%", top: "24%", status: "Delayed" },
    { name: "Chanra", left: "49%", top: "68%", status: "Online" },
    { name: "Sokha", left: "75%", top: "58%", status: "Available" },
  ];

  return (
    <div className="relative h-[420px] overflow-hidden rounded-lg bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-25">
        <div className="absolute left-0 top-14 h-1 w-full rotate-[-9deg] bg-white" />
        <div className="absolute left-0 top-36 h-1 w-full rotate-[14deg] bg-white" />
        <div className="absolute left-0 top-64 h-1 w-full rotate-[-3deg] bg-white" />
        <div className="absolute left-20 top-0 h-full w-1 rotate-[9deg] bg-white" />
        <div className="absolute left-52 top-0 h-full w-1 rotate-[-13deg] bg-white" />
        <div className="absolute right-24 top-0 h-full w-1 rotate-[5deg] bg-white" />
      </div>

      {["BKK1", "Toul Kork", "Riverside"].map((zone, index) => (
        <div
          key={zone}
          className={`absolute rounded-full bg-red-500/35 ring-4 ring-red-500/25 ${
            index === 0 ? "left-14 top-16 h-28 w-28" : index === 1 ? "right-20 top-12 h-24 w-24" : "bottom-16 left-1/2 h-20 w-20"
          }`}
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-red-600 px-2 py-1 text-xs font-black">
            {zone}
          </span>
        </div>
      ))}

      {riderPins.map((pin) => (
        <div key={pin.name} className="absolute" style={{ left: pin.left, top: pin.top }}>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-white ring-4 ${
              pin.status === "Delayed" ? "bg-red-500 ring-red-300/40" : "bg-emerald-500 ring-emerald-300/35"
            }`}
          >
            <Bike className="h-6 w-6" />
          </div>
          <div className="mt-1 rounded-md bg-black/65 px-2 py-1 text-center text-xs font-black">{pin.name}</div>
        </div>
      ))}

      <div className="absolute bottom-3 left-3 right-3 grid gap-2 md:grid-cols-3">
        {liveOrders.map((order) => (
          <div key={order.id} className="rounded-lg bg-black/60 p-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="font-black">#{order.id}</div>
              <span className={order.status === "Delayed" || order.status === "Issue" ? "text-red-300" : "text-emerald-300"}>
                {order.eta}
              </span>
            </div>
            <div className="mt-1 text-xs text-white/70">{order.rider} · {order.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewPanel() {
  const activeMerchants = restaurants.filter((restaurant) => restaurant.isOpen && restaurant.isApproved && !restaurant.isBlocked).length;
  const onlineRiders = riders.filter((rider) => rider.isOnline).length;
  const liveOrders = orders.filter((order) => order.status !== "Completed" && order.status !== "Cancelled").length + initialLiveOrders.length;
  const grossVolume = volumeData.reduce((sum, item) => sum + item.gmv, 0);
  const commission = volumeData.reduce((sum, item) => sum + item.commission, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Merchants" value={activeMerchants.toString()} sub="Open and approved now" icon={Store} tone="bg-orange-50 text-orange-600" />
        <KpiCard label="Online Riders" value={onlineRiders.toString()} sub="Ready or on delivery" icon={Bike} tone="bg-amber-50 text-amber-600" />
        <KpiCard label="Live Orders" value={liveOrders.toString()} sub="Needs system visibility" icon={ShoppingBag} tone="bg-red-50 text-red-600" />
        <KpiCard label="Commission Earned" value={money(commission)} sub={`GMV ${money(grossVolume)}`} icon={DollarSign} tone="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Platform Health</h2>
              <p className="text-sm text-slate-500">Total gross volume and EatZone commission.</p>
            </div>
            <StatusBadge status="Live" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}K`} />
              <Tooltip formatter={(value: number, name: string) => [money(value), name === "gmv" ? "Gross Volume" : "Commission"]} />
              <Area type="monotone" dataKey="gmv" stroke="#e11d48" strokeWidth={2.5} fill="url(#gmvGradient)" />
              <Area type="monotone" dataKey="commission" stroke="#f97316" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-xl font-black text-slate-950">Operations Queue</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "KYC Pending", value: initialApprovals.length, icon: FileCheck, tone: "bg-amber-50 text-amber-700" },
              { label: "Orders With Issues", value: 2, icon: AlertTriangle, tone: "bg-red-50 text-red-700" },
              { label: "Refund Requests", value: refundQueue.length, icon: RefreshCcw, tone: "bg-blue-50 text-blue-700" },
              { label: "Payouts Pending", value: initialPayouts.filter((payout) => payout.status === "Pending").length, icon: CreditCard, tone: "bg-emerald-50 text-emerald-700" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-slate-950">{item.label}</div>
                  <div className="text-xs text-slate-500">Admin action recommended</div>
                </div>
                <div className="text-2xl font-black text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AccountsPanel() {
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(initialApprovals);
  const [blockedUsers, setBlockedUsers] = useState(users.filter((user) => !user.isActive).map((user) => user.id));
  const [query, setQuery] = useState("");

  const visibleUsers = users.filter((user) => {
    const haystack = `${user.name} ${user.email} ${user.role}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const updateApproval = (id: string, status: ApprovalRequest["status"]) => {
    setApprovalRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)));
  };

  const toggleBlockUser = (id: string) => {
    setBlockedUsers((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]));
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Approvals & KYC</h2>
            <p className="text-sm text-slate-500">Review IDs, licenses, merchant documents.</p>
          </div>
          <StatusBadge status={`${approvalRequests.filter((item) => item.status === "Pending").length} Pending`} />
        </div>

        <div className="space-y-3">
          {approvalRequests.map((request) => (
            <div key={request.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-950">{request.name}</h3>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">{request.type}</span>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{request.id} · {request.phone} · {request.submittedAt}</p>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-black ${request.risk === "High" ? "bg-red-50 text-red-700" : request.risk === "Medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {request.risk} risk
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {request.documents.map((document) => (
                  <span key={document} className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                    <FileCheck className="h-3.5 w-3.5" />
                    {document}
                  </span>
                ))}
              </div>

              {request.status === "Pending" && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateApproval(request.id, "Approved")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-black text-white"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => updateApproval(request.id, "Rejected")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-black text-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-950">User & Role Management</h2>
          <p className="text-sm text-slate-500">Suspend abusive customers, riders, or merchants.</p>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search user, role, email..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-3">
          {visibleUsers.map((user) => {
            const isBlocked = blockedUsers.includes(user.id);
            return (
              <div key={user.id} className={`flex items-center gap-3 rounded-lg border p-3 ${isBlocked ? "border-red-200 bg-red-50" : "border-slate-200"}`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-sm font-black text-white">{user.avatar}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-black text-slate-950">{user.name}</div>
                  <div className="truncate text-xs text-slate-500">{user.email}</div>
                  <div className="mt-1 text-xs font-bold capitalize text-slate-500">{user.role}</div>
                </div>
                <button
                  onClick={() => toggleBlockUser(user.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-black ${isBlocked ? "bg-emerald-500 text-white" : "bg-red-50 text-red-600"}`}
                >
                  {isBlocked ? "Unblock" : "Suspend"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function LiveOrdersPanel() {
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>(initialLiveOrders);

  const cancelOrder = (id: string) => {
    setLiveOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const reassignRider = (id: string) => {
    setLiveOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, rider: "Chanra Lim", status: "Rider Picking", eta: "14 min" } : order,
      ),
    );
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Live Order Monitoring</h2>
            <p className="text-sm text-slate-500">God View map of riders, orders, and hot zones.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Realtime
          </span>
        </div>
        <AdminMap liveOrders={liveOrders} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-xl font-black text-slate-950">Intervention Queue</h2>
        <p className="mb-4 text-sm text-slate-500">Cancel or reassign when a delivery is at risk.</p>
        <div className="space-y-3">
          {liveOrders.map((order) => (
            <div key={order.id} className={`rounded-lg border p-3 ${order.status === "Issue" || order.status === "Delayed" ? "border-red-200 bg-red-50" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-black text-slate-950">#{order.id}</div>
                  <div className="text-xs text-slate-500">{order.merchant} → {order.customer}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
                <div className="rounded-md bg-white/70 p-2">Rider: {order.rider}</div>
                <div className="rounded-md bg-white/70 p-2">ETA: {order.eta}</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => reassignRider(order.id)}
                  className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 py-2 text-xs font-black text-white"
                >
                  <Truck className="h-3.5 w-3.5" />
                  Reassign
                </button>
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="flex items-center justify-center gap-1 rounded-lg bg-red-600 px-2 py-2 text-xs font-black text-white"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FinancePanel() {
  const [payouts, setPayouts] = useState<PayoutItem[]>(initialPayouts);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(initialCommissionRules);

  const markPaid = (id: string) => {
    setPayouts((prev) => prev.map((payout) => (payout.id === id ? { ...payout, status: "Paid" } : payout)));
  };

  const updateCommission = (id: string, rate: number) => {
    setCommissionRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, rate } : rule)));
  };

  const pendingTotal = payouts.filter((payout) => payout.status === "Pending").reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Pending Payouts" value={money(pendingTotal)} sub="Merchants and riders" icon={CreditCard} tone="bg-blue-50 text-blue-600" />
        <KpiCard label="Refund Queue" value={refundQueue.length.toString()} sub="Customer refunds pending" icon={RefreshCcw} tone="bg-red-50 text-red-600" />
        <KpiCard label="Avg Commission" value="17%" sub="Across top merchants" icon={Percent} tone="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-xl font-black text-slate-950">Commission Setup</h2>
          <p className="mb-4 text-sm text-slate-500">Set merchant-specific commission rates.</p>
          <div className="space-y-3">
            {commissionRules.map((rule) => (
              <div key={rule.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-black text-slate-950">{rule.merchant}</div>
                  <div className="text-lg font-black text-emerald-600">{rule.rate}%</div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="25"
                  value={rule.rate}
                  onChange={(event) => updateCommission(rule.id, Number(event.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>10%</span>
                  <span>25%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-xl font-black text-slate-950">Settlement / Payouts</h2>
          <p className="mb-4 text-sm text-slate-500">Mark merchant and rider payouts after transfer.</p>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[1fr_100px_100px_110px] bg-slate-50 px-3 py-2 text-xs font-black text-slate-500">
              <div>Recipient</div>
              <div>Amount</div>
              <div>Method</div>
              <div>Status</div>
            </div>
            {payouts.map((payout) => (
              <div key={payout.id} className="grid grid-cols-[1fr_100px_100px_110px] items-center border-t border-slate-100 px-3 py-3 text-sm">
                <div>
                  <div className="font-black text-slate-950">{payout.recipient}</div>
                  <div className="text-xs text-slate-500">{payout.role} · {payout.id}</div>
                </div>
                <div className="font-black">{money(payout.amount)}</div>
                <div>{payout.method}</div>
                <div>
                  {payout.status === "Pending" ? (
                    <button
                      onClick={() => markPaid(payout.id)}
                      className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-white"
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <StatusBadge status="Paid" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-red-600" />
              <h3 className="font-black text-red-900">Refunds</h3>
            </div>
            <div className="space-y-2">
              {refundQueue.map((refund) => (
                <div key={refund.id} className="flex items-center justify-between rounded-md bg-white p-3">
                  <div>
                    <div className="font-black text-slate-950">{refund.id} · #{refund.orderId}</div>
                    <div className="text-xs text-slate-500">{refund.customer} · {refund.reason}</div>
                  </div>
                  <div className="font-black text-red-600">{money(refund.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MarketingPanel() {
  const [banners, setBanners] = useState(initialBanners);
  const [promos, setPromos] = useState(initialPromos);
  const [deliveryFee, setDeliveryFee] = useState({ baseKm: 3, baseFee: 1, extraKmFee: 0.3 });
  const [promoCode, setPromoCode] = useState("");

  const addPromo = () => {
    if (!promoCode.trim()) return;
    setPromos((prev) => [{ code: promoCode.trim().toUpperCase(), discount: "25%", budget: 300, owner: "EatZone" }, ...prev]);
    setPromoCode("");
  };

  const addBanner = () => {
    setBanners((prev) => [
      { id: `BN-${Date.now().toString().slice(-3)}`, title: "New Promotion Banner", placement: "Customer Home", status: "Scheduled" },
      ...prev,
    ]);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Banners</h2>
              <p className="text-sm text-slate-500">Upload campaign banners for customer home.</p>
            </div>
            <button
              onClick={addBanner}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-black text-white hover:bg-rose-700"
            >
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>
          <div className="space-y-3">
            {banners.map((banner) => (
              <div key={banner.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-amber-400 text-white">
                  <ImagePlus className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-slate-950">{banner.title}</div>
                  <div className="text-xs text-slate-500">{banner.placement}</div>
                </div>
                <StatusBadge status={banner.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-xl font-black text-slate-950">Delivery Fee Logic</h2>
          <p className="mb-4 text-sm text-slate-500">Formula example: first 3km $1, next km $0.30.</p>
          <div className="grid gap-3">
            {[
              { label: "Base kilometers", key: "baseKm" as const, step: 1 },
              { label: "Base fee", key: "baseFee" as const, step: 0.25 },
              { label: "Extra km fee", key: "extraKmFee" as const, step: 0.05 },
            ].map((field) => (
              <label key={field.key} className="grid grid-cols-[1fr_120px] items-center gap-3">
                <span className="text-sm font-black text-slate-700">{field.label}</span>
                <input
                  type="number"
                  step={field.step}
                  value={deliveryFee[field.key]}
                  onChange={(event) => setDeliveryFee((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold outline-none"
                />
              </label>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-slate-100 p-3 text-sm font-black text-slate-700">
            Current: first {deliveryFee.baseKm}km {money(deliveryFee.baseFee)}, then {money(deliveryFee.extraKmFee)}/km
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-xl font-black text-slate-950">Global Promo Codes</h2>
        <p className="mb-4 text-sm text-slate-500">EatZone-funded promotions across the platform.</p>
        <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            placeholder="e.g. KHMERNEWYEAR"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          />
          <button
            onClick={addPromo}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-black text-white"
          >
            <Gift className="h-4 w-4" />
            Create
          </button>
        </div>

        <div className="space-y-3">
          {promos.map((promo) => (
            <div key={promo.code} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xl font-black text-slate-950">{promo.code}</div>
                  <div className="text-sm text-slate-500">{promo.owner}-funded campaign</div>
                </div>
                <div className="rounded-lg bg-red-50 px-3 py-2 text-lg font-black text-red-600">{promo.discount}</div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-md bg-slate-50 p-2 text-sm font-bold text-slate-600">
                <span>Budget</span>
                <span>{money(promo.budget)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>("overview");

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-rose-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                <Shield className="h-4 w-4" />
                Super Admin Panel
              </div>
              <h1 className="text-3xl font-black text-slate-950">EatZone Control Center</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Brain of the platform: customers, merchants, riders, orders, finance, and marketing.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:w-[420px]">
              <div className="rounded-lg bg-emerald-50 p-3 text-center">
                <div className="text-2xl font-black text-emerald-700">99.8%</div>
                <div className="text-xs font-bold text-emerald-600">API Health</div>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-center">
                <div className="text-2xl font-black text-amber-700">4</div>
                <div className="text-xs font-bold text-amber-600">Open Risks</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <div className="text-2xl font-black text-blue-700">Live</div>
                <div className="text-xs font-bold text-blue-600">Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        <nav className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
          {adminViews.map((view) => {
            const isActive = activeView === view.id;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex min-w-[150px] items-center gap-2 rounded-lg px-3 py-3 text-left transition ${
                  isActive ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <view.icon className="h-5 w-5" />
                <span>
                  <span className="block text-sm font-black">{view.label}</span>
                  <span className="block text-xs opacity-70">{view.khmer}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {activeView === "overview" && <OverviewPanel />}
        {activeView === "accounts" && <AccountsPanel />}
        {activeView === "live" && <LiveOrdersPanel />}
        {activeView === "finance" && <FinancePanel />}
        {activeView === "marketing" && <MarketingPanel />}
      </div>
    </div>
  );
}
