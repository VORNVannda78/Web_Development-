import { Outlet, useLocation, useNavigate } from "react-router";
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  Search,
  Shield,
  Store,
  Users,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: Store, label: "Merchants", path: "/admin/restaurants" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <button onClick={() => navigate("/admin")} className="flex items-center gap-3 px-6 py-5 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-950">EatZone Admin</div>
            <div className="text-xs font-semibold text-slate-400">Super Admin Panel</div>
          </div>
        </button>

        <nav className="flex-1 px-3 py-3">
          <div className="mb-2 px-3 text-xs font-black uppercase tracking-wide text-slate-400">Workspace</div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/admin" && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? "bg-rose-50 text-rose-700"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-rose-600" />}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="m-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-black text-slate-900">System health</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">99.8% uptime today</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[88%] rounded-full bg-rose-500" />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
            <button onClick={() => navigate("/admin")} className="flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-950">EatZone Admin</div>
                <div className="text-xs font-semibold text-slate-400">Super Admin</div>
              </div>
            </button>

            <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                placeholder="Search orders, merchants, riders, users..."
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                <Bell className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-black text-white">AD</div>
                <div className="hidden text-left sm:block">
                  <div className="text-xs font-black text-slate-950">Admin</div>
                  <div className="text-[11px] font-semibold text-slate-400">Owner access</div>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/admin" && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-black ${
                    isActive ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
