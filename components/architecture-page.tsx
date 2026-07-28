"use client";

import { Activity, Database, GitBranch, PackageCheck, Radar, Workflow } from "lucide-react";

import { architecturePillars, serviceHealthSeed } from "@/lib/demo-data";

const layers = [
  {
    title: "Client and homepage experience",
    detail: "Next.js presents the academic story, animated service highlights, and the working commerce interface.",
    icon: Radar,
  },
  {
    title: "Gateway and identity edge",
    detail: "All protected actions pass through a gateway layer with token-aware route handlers and service orchestration.",
    icon: Workflow,
  },
  {
    title: "Bounded services",
    detail: "Catalog, order, payment, and notification responsibilities are modeled as cohesive server modules and API surfaces.",
    icon: GitBranch,
  },
  {
    title: "Data and events",
    detail: "Per-service thinking is preserved through isolated resource models and a simulated async event trail.",
    icon: Database,
  },
  {
    title: "Cloud operations",
    detail: "Docker, Kubernetes, autoscaling, and observability remain first-class design concerns in the UI and docs.",
    icon: PackageCheck,
  },
];

export function ArchitecturePage() {
  return (
    <div className="bg-[#0a1321] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="max-w-4xl">
          <p className="text-xs tracking-[0.28em] text-sky-200 uppercase">Architecture explorer</p>
          <h1 className="font-display mt-3 text-5xl">
            The interface exposes the architecture instead of hiding it behind generic ecommerce screens.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This page is designed for supervisors, examiners, and technical reviewers who need to inspect the service decomposition, request path, observability plan, and deployment readiness clearly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {layers.map((layer) => (
            <div key={layer.title} className="section-card rounded-[2rem] p-5">
              <layer.icon className="h-7 w-7 text-sky-200" />
              <h2 className="mt-5 text-lg font-semibold">{layer.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{layer.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="section-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3 text-sky-200">
              <Activity className="h-5 w-5" />
              <span className="text-xs tracking-[0.28em] uppercase">Operational signals</span>
            </div>
            <div className="mt-6 space-y-4">
              {serviceHealthSeed.map((service) => (
                <div key={service.name} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{service.name}</p>
                    <p className="text-sm text-slate-300">{service.latencyMs} ms</p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{service.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3 text-emerald-200">
              <Database className="h-5 w-5" />
              <span className="text-xs tracking-[0.28em] uppercase">Architecture principles</span>
            </div>
            <div className="mt-6 space-y-4">
              {architecturePillars.map((pillar) => (
                <div key={pillar} className="rounded-[1.5rem] border border-white/10 px-4 py-4 text-sm leading-7 text-slate-300">
                  {pillar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
