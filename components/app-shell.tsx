"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, LogOut, ShieldCheck, ShoppingCart } from "lucide-react";

import type { CartItem } from "@/lib/types";
import { useAppStore } from "@/stores/use-app-store";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/checkout", label: "Checkout" },
  { href: "/orders", label: "Orders" },
  { href: "/architecture", label: "Architecture" },
  { href: "/admin", label: "Admin" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, cart, signOut } = useAppStore();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(67,182,255,0.18),_transparent_35%),linear-gradient(180deg,_#070b15_0%,_#09111c_42%,_#f4efe7_42%,_#f4efe7_100%)] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl border border-sky-400/30 bg-sky-400/10 p-2 text-sky-200">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-sky-200 uppercase">
                Tasued FYP
              </p>
              <p className="text-sm text-slate-300">
                Scalable Microservices Retail Platform
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/checkout"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{cart.reduce((count: number, item: CartItem) => count + item.quantity, 0)}</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100 md:block">
                  {user.fullName}
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/sign-in"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-900/10 bg-[#f4efe7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-900">
              Design and Implementation of a Scalable Microservices Architecture
            </p>
            <p className="mt-2 max-w-2xl">
              A final year project prototype translating the research paper into a working fullstack demonstration with strong product storytelling.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Gateway-authenticated workflows</span>
            </div>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-sky-600" />
              <span>Observability-first views</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
