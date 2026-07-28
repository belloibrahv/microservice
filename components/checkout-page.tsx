"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, LockKeyhole, Trash2 } from "lucide-react";

import { apiRequest } from "@/lib/api";
import { productsSeed } from "@/lib/demo-data";
import type { Order, Product } from "@/lib/types";
import { useAppStore } from "@/stores/use-app-store";

export function CheckoutPage() {
  const token = useAppStore((state) => state.token);
  const cart = useAppStore((state) => state.cart);
  const clearCart = useAppStore((state) => state.clearCart);
  const setQuantity = useAppStore((state) => state.setQuantity);
  const user = useAppStore((state) => state.user);
  const [message, setMessage] = useState("Orders will move through pending, payment, and notification flows instantly in the demo.");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [pending, setPending] = useState(false);

  const cartProducts = useMemo(() => {
    return cart
      .map((item) => {
        const product = productsSeed.find((entry) => entry.id === item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter(Boolean) as Array<{ product: Product; quantity: number }>;
  }, [cart]);

  const total = cartProducts.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0
  );

  const submitOrder = async () => {
    if (!token) {
      setMessage("Please sign in before trying to place an order.");
      return;
    }

    setPending(true);
    try {
      const order = await apiRequest<Order>(
        "/api/orders",
        {
          method: "POST",
          body: JSON.stringify({
            items: cart,
          }),
        },
        token
      );

      setCreatedOrder(order);
      clearCart();
      setMessage("Order created. The event-driven services have updated its final status.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Order request failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="bg-[#f4efe7] px-6 py-16 text-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.28em] text-slate-500 uppercase">Order service and payment flow</p>
            <h1 className="font-display mt-3 text-5xl">Checkout through the gateway-backed order pipeline.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              The checkout experience validates inventory, creates an order, simulates payment processing, and records notifications in the same request cycle for this demo build.
            </p>
          </div>

          <div className="light-card rounded-[2rem] p-6">
            {cartProducts.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-8 text-center">
                <p className="text-lg font-semibold">Your cart is empty.</p>
                <p className="mt-3 text-sm text-slate-500">
                  Add products from the catalog to see the order pipeline in action.
                </p>
                <Link
                  href="/catalog"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Go to catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartProducts.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 px-5 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(product.id, Number(event.target.value) || 1)
                        }
                        className="w-20 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(product.id, 0)}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="light-card rounded-[2rem] p-6">
          <div className="flex items-center gap-3 text-slate-500">
            <LockKeyhole className="h-5 w-5 text-emerald-700" />
            <span className="text-xs tracking-[0.28em] uppercase">Checkout summary</span>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="mt-2 text-lg font-semibold">{user?.fullName ?? "Guest visitor"}</p>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{cartProducts.reduce((sum, entry) => sum + entry.quantity, 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span>NGN {total.toLocaleString()}</span>
              </div>
            </div>
            <button
              type="button"
              disabled={pending || cartProducts.length === 0}
              onClick={submitOrder}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 disabled:opacity-60"
            >
              {pending ? "Processing order..." : "Place order"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 px-5 py-5 text-sm leading-7 text-slate-600">
            {message}
          </div>

          {createdOrder ? (
            <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-5">
              <p className="text-sm font-semibold text-emerald-900">Latest order: {createdOrder.id}</p>
              <p className="mt-2 text-sm text-emerald-800">Status: {createdOrder.status}</p>
              <Link href={`/orders/${createdOrder.id}`} className="mt-4 inline-block text-sm font-semibold text-emerald-900">
                Open the order timeline
              </Link>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
