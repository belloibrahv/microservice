"use client";

import { useEffect, useState } from "react";
import { Activity, BarChart3, ShieldEllipsis, TrendingUp } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Order, ServiceHealth } from "@/lib/types";
import { useAppStore } from "@/stores/use-app-store";

type AdminOverview = {
  serviceHealth: ServiceHealth[];
  totals: {
    users: number;
    products: number;
    orders: number;
    notifications: number;
  };
  recentOrders: Order[];
};

const mockMetrics = {
  requestRate: {
    current: 245,
    peak: 312,
    trend: "+12%",
  },
  errorRate: {
    current: 0.8,
    threshold: 1.0,
    trend: "-0.3%",
  },
  avgLatency: {
    current: 52,
    p95: 89,
    trend: "+5ms",
  },
  throughput: {
    current: 1800,
    capacity: 5000,
    trend: "+8%",
  },
};

const mockLogs = [
  { timestamp: "2025-01-15T14:32:01Z", service: "API Gateway", level: "INFO", message: "Token validated for user user-customer-1" },
  { timestamp: "2025-01-15T14:32:02Z", service: "Order Service", level: "INFO", message: "Order order-abc123 created with status pending" },
  { timestamp: "2025-01-15T14:32:03Z", service: "Payment Service", level: "INFO", message: "Payment processing initiated for order order-abc123" },
  { timestamp: "2025-01-15T14:32:04Z", service: "Notification Service", level: "INFO", message: "Order confirmation email dispatched to customer" },
  { timestamp: "2025-01-15T14:32:05Z", service: "Payment Service", level: "INFO", message: "Payment succeeded for order order-abc123" },
  { timestamp: "2025-01-15T14:32:06Z", service: "Order Service", level: "INFO", message: "Order order-abc123 status updated to confirmed" },
  { timestamp: "2025-01-15T14:32:07Z", service: "Catalog Service", level: "WARN", message: "Stock threshold warning for product prod-edge-node" },
  { timestamp: "2025-01-15T14:32:08Z", service: "API Gateway", level: "INFO", message: "Rate limit check passed for 192.168.1.100" },
];

export function AdminPage() {
  const token = useAppStore((state) => state.token);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [message, setMessage] = useState(
    "Use the seeded admin account to inspect the operational view."
  );
  const helperMessage = token
    ? message
    : "Please sign in as the demo admin to view operations.";

  useEffect(() => {
    if (!token) {
      return;
    }

    void apiRequest<AdminOverview>("/api/admin/overview", {}, token)
      .then((data) => {
        setOverview(data);
        setMessage("Admin operations loaded.");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Admin overview failed.");
      });
  }, [token]);

  return (
    <div className="bg-[#f4efe7] px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-xs tracking-[0.28em] text-slate-500 uppercase">Admin operations</p>
          <h1 className="font-display mt-3 text-5xl">Observability dashboard and service health.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">{helperMessage}</p>
        </div>

        {overview ? (
          <>
            <div className="grid gap-6 md:grid-cols-4">
              {Object.entries(overview.totals).map(([label, value]) => (
                <div key={label} className="light-card rounded-[2rem] p-6">
                  <p className="text-xs tracking-[0.24em] text-slate-500 uppercase">{label}</p>
                  <p className="mt-4 text-3xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="light-card rounded-[2rem] p-6">
              <div className="flex items-center gap-3 text-slate-500">
                <BarChart3 className="h-5 w-5 text-sky-700" />
                <span className="text-xs tracking-[0.28em] uppercase">Real-time metrics</span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[1.5rem] border border-slate-200 px-4 py-4">
                  <p className="text-xs text-slate-500">Request Rate</p>
                  <p className="mt-2 text-2xl font-semibold">{mockMetrics.requestRate.current}/min</p>
                  <p className="mt-1 text-sm text-emerald-600">{mockMetrics.requestRate.trend} from peak</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 px-4 py-4">
                  <p className="text-xs text-slate-500">Error Rate</p>
                  <p className="mt-2 text-2xl font-semibold">{mockMetrics.errorRate.current}%</p>
                  <p className="mt-1 text-sm text-emerald-600">{mockMetrics.errorRate.trend} under threshold</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 px-4 py-4">
                  <p className="text-xs text-slate-500">Avg Latency</p>
                  <p className="mt-2 text-2xl font-semibold">{mockMetrics.avgLatency.current}ms</p>
                  <p className="mt-1 text-sm text-amber-600">P95: {mockMetrics.avgLatency.p95}ms</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 px-4 py-4">
                  <p className="text-xs text-slate-500">Throughput</p>
                  <p className="mt-2 text-2xl font-semibold">{mockMetrics.throughput.current}/hr</p>
                  <p className="mt-1 text-sm text-emerald-600">{mockMetrics.throughput.trend} capacity</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="light-card rounded-[2rem] p-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <ShieldEllipsis className="h-5 w-5 text-sky-700" />
                  <span className="text-xs tracking-[0.28em] uppercase">Service health</span>
                </div>
                <div className="mt-6 space-y-4">
                  {overview.serviceHealth.map((service) => (
                    <div key={service.name} className="rounded-[1.5rem] border border-slate-200 px-4 py-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{service.name}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-500">{service.replicas} replicas</span>
                          <span className="text-sm text-slate-500">{service.latencyMs}ms</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{service.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="light-card rounded-[2rem] p-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <Activity className="h-5 w-5 text-emerald-700" />
                  <span className="text-xs tracking-[0.28em] uppercase">Distributed logs</span>
                </div>
                <div className="mt-6 space-y-3 max-h-80 overflow-y-auto">
                  {mockLogs.map((log, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600">{log.service}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          log.level === "ERROR" ? "bg-red-100 text-red-700" :
                          log.level === "WARN" ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>{log.level}</span>
                      </div>
                      <p className="mt-2 text-slate-700">{log.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="light-card rounded-[2rem] p-6">
              <div className="flex items-center gap-3 text-slate-500">
                <TrendingUp className="h-5 w-5 text-indigo-700" />
                <span className="text-xs tracking-[0.28em] uppercase">Recent orders</span>
              </div>
              <div className="mt-6 space-y-4">
                {overview.recentOrders.map((order) => (
                  <div key={order.id} className="rounded-[1.5rem] border border-slate-200 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{order.id}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "failed" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>{order.status}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-slate-600">
                        NGN {order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
