import { Link } from "@tanstack/react-router";
import { LayoutPanelLeft, Users, Activity, TriangleAlert, Settings, Search, Zap } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutPanelLeft, match: (p: string) => p === "/" },
  { to: "/user-management", label: "User Management", icon: Users, match: (p: string) => p.startsWith("/user") },
  { to: "/consumption-analytics", label: "Consumption Analytics", icon: Activity, match: (p: string) => p.startsWith("/consumption") },
  { to: "/anomaly-flags", label: "Anomaly Flags", icon: TriangleAlert, match: (p: string) => p.startsWith("/anomaly") },
  { to: "/settings", label: "Settings", icon: Settings, match: (p: string) => p.startsWith("/settings") },
] as const;

export function AdminLayout({ title, children, footer }: { title: string; children: ReactNode; footer?: ReactNode }) {
  const path = typeof window === "undefined" ? "" : window.location.pathname;
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <p className="text-xl font-extrabold text-brand">KiloWhat</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[1px] text-subtle">Admin Panel</p>
        </div>
        <nav className="mt-8 flex flex-col gap-1.5">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-subtle transition-colors hover:bg-muted"
              activeProps={{ className: "!bg-brand-soft !text-brand font-semibold" }}
              data-path={path}
            >
              <n.icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{n.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[72px] items-center justify-between border-b border-border bg-card px-8">
          <h1 className="text-xl font-bold text-ink">{title}</h1>
          <div className="flex items-center gap-5">
            <label className="flex w-[260px] items-center gap-2 rounded-lg border border-border px-3 py-1.5">
              <Search className="h-4 w-4 text-subtle" />
              <input placeholder="Search submeters, units..." className="w-full bg-transparent text-sm outline-none placeholder:text-subtle" />
            </label>
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">John Doe</p>
              <p className="text-xs text-subtle">Admin</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 pb-24">{children}</main>
        {footer}
      </div>
    </div>
  );
}
