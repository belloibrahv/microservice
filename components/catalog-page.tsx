"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useAppStore } from "@/stores/use-app-store";

export function CatalogPage() {
  const addToCart = useAppStore((state) => state.addToCart);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Loading catalog...");

  useEffect(() => {
    void apiRequest<Product[]>("/api/catalog/products")
      .then((data) => {
        setProducts(data);
        setStatus("Catalog ready.");
      })
      .catch((error) => {
        setStatus(error instanceof Error ? error.message : "Failed to load catalog.");
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
    );
  }, [products, query]);

  return (
    <div className="bg-[#f4efe7] px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.28em] text-slate-500 uppercase">Catalog service</p>
            <h1 className="font-display mt-3 text-5xl">Browse the demo products routed through the gateway.</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Each item exists to demonstrate stock checks, order validation, payment outcomes, and notification events in the research-driven workflow.
            </p>
          </div>
          <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or category"
              className="w-64 bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        <p className="mt-6 text-sm text-slate-500">{status}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="light-card rounded-[2rem] overflow-hidden">
              <div className={`relative h-64 bg-gradient-to-br ${product.accent}`}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs tracking-[0.2em] text-white uppercase">
                    {product.category}
                  </span>
                  <span className="text-sm text-slate-500">{product.stock} in stock</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{product.name}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">NGN {product.price.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Lead time: {product.leadTime}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
