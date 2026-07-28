"use client";

import { useEffect, useState } from "react";
import { BellRing, Boxes, CreditCard, RadioTower } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { NotificationLog, Order } from "@/lib/types";
import { useAppStore } from "@/stores/use-app-store";

const flowIcons = [RadioTower, Boxes, CreditCard, BellRing];

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const token = useAppStore((state) => state.token);
  const [order, setOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [message, setMessage] = useState("Loading order detail...");
  const helperMessage = token ? message : "Sign in to inspect an order.";

  useEffect(() => {
    if (!token) {
      return;
    }

    void Promise.all([
      apiRequest<Order>(`/api/orders/${orderId}`, {}, token),
      apiRequest<NotificationLog[]>(`/api/notifications/${orderId}`, {}, token),
    ])
      .then(([orderResult, notificationResult]) => {
        setOrder(orderResult);
        setNotifications(notificationResult);
        setMessage("Order detail loaded.");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Failed to load order detail.");
      });
  }, [orderId, token]);

  if (!order) {
    return (
      <div className="bg-[#f4efe7] px-6 py-20 text-center text-slate-600">
        <p>{helperMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f4efe7] px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-xs tracking-[0.28em] text-slate-500 uppercase">Order detail</p>
          <h1 className="font-display mt-3 text-5xl">{order.id}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">{helperMessage}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="light-card rounded-[2rem] p-6">
            <p className="text-sm font-semibold">Service timeline</p>
            <div className="mt-6 space-y-4">
              {order.eventTrail.map((event, index) => {
                const Icon = flowIcons[index % flowIcons.length];
                return (
                  <div key={event} className="flex gap-4 rounded-[1.5rem] border border-slate-200 px-4 py-4">
                    <div className="rounded-2xl bg-slate-950 p-3 text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{event}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="light-card rounded-[2rem] p-6">
              <p className="text-sm font-semibold">Order summary</p>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span className="font-semibold">{order.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-semibold">NGN {order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="font-semibold">{order.items.length}</span>
                </div>
              </div>
            </div>

            <div className="light-card rounded-[2rem] p-6">
              <p className="text-sm font-semibold">Notifications</p>
              <div className="mt-5 space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="rounded-[1.5rem] border border-slate-200 px-4 py-4">
                    <p className="text-sm font-semibold">{notification.type.replace("_", " ")}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{notification.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
