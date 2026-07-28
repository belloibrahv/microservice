"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Order } from "@/lib/types";
import { useAppStore } from "@/stores/use-app-store";

export function OrdersPage() {
  const token = useAppStore((state) => state.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("Loading order history...");
  const helperMessage = token
    ? message
    : "Sign in to inspect your event-driven order history.";

  useEffect(() => {
    if (!token) {
      return;
    }

    void apiRequest<Order[]>("/api/orders", {}, token)
      .then((data) => {
        setOrders(data);
        setMessage(data.length ? "Order history loaded." : "No orders yet.");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Could not load orders.");
      });
  }, [token]);

  return (
    <div className="bg-[#f4efe7] px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs tracking-[0.28em] text-slate-500 uppercase">Orders dashboard</p>
        <h1 className="font-display mt-3 text-5xl">Track the service outcomes attached to each order.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{helperMessage}</p>

        <div className="mt-10 space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="light-card rounded-[2rem] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-sky-700" />
                    <p className="text-lg font-semibold">{order.id}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Created on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    order.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-900"
                      : order.status === "failed"
                        ? "bg-rose-100 text-rose-900"
                        : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 px-5 py-5">
                  <p className="text-sm font-semibold">Items</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between">
                        <span>{item.productName}</span>
                        <span>{item.quantity} x NGN {item.unitPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 px-5 py-5">
                  <p className="text-sm font-semibold">Gateway and service trail</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {order.eventTrail.map((event) => (
                      <p key={event}>{event}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-semibold">Total: NGN {order.totalAmount.toLocaleString()}</p>
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
                >
                  View detail
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
