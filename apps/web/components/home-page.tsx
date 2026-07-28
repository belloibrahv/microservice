"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Blocks,
  Cloud,
  Database,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  architecturePillars,
  researchers,
  researchMetrics,
  serviceHealthSeed,
  supervisor,
} from "@/lib/demo-data";

const serviceCards = [
  {
    name: "Gateway and Identity",
    detail: "A secure edge that authenticates traffic, enforces flow control, and gives the rest of the platform a stable entry point.",
    icon: ShieldCheck,
  },
  {
    name: "Commerce Domain Services",
    detail: "Catalog, order, payment, and notification responsibilities stay cohesive and independently understandable.",
    icon: Blocks,
  },
  {
    name: "Cloud Operations Layer",
    detail: "Observability, containerization, and Kubernetes readiness make the demo reflect current industry practice.",
    icon: Cloud,
  },
];

export function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="noise-overlay absolute inset-0" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs tracking-[0.28em] text-sky-100 uppercase">
              <Sparkles className="h-4 w-4" />
              Final Year Project Implementation
            </div>
            <div className="space-y-6">
              <h1 className="font-display max-w-4xl text-5xl leading-none text-white md:text-7xl">
                A cloud-native retail platform that explains its microservices architecture before users even click deeper.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                This implementation turns the research paper into a working product story. The homepage introduces the problem, objectives, service boundaries, observability model, and academic team while the app demonstrates real catalog, checkout, and order workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
              >
                Explore the catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/architecture"
                className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View the architecture
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {researchMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.12 }}
                  className="section-card rounded-3xl p-5"
                >
                  <p className="text-xs tracking-[0.24em] text-slate-400 uppercase">{metric.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{metric.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="section-card rounded-[2rem] p-6"
          >
            <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-6">
              <div className="grid gap-4">
                {serviceHealthSeed.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{service.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{service.summary}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          service.status === "healthy"
                            ? "bg-emerald-400/15 text-emerald-200"
                            : "bg-amber-300/15 text-amber-200"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>{service.replicas} replicas</span>
                      <span>{service.latencyMs} ms latency</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f4efe7] text-slate-950">
        <div className="mx-auto max-w-7xl space-y-10 px-6 py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.28em] text-slate-500 uppercase">Research translation</p>
              <h2 className="font-display mt-3 text-4xl md:text-5xl">
                  The implementation scope is driven directly by the paper&apos;s architecture.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Rather than building a generic storefront, this interface makes the academic value visible: gateway routing, service discovery logic, event-driven processing, observability, and deployment readiness.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <div key={card.name} className="light-card rounded-[2rem] p-6">
                <card.icon className="h-8 w-8 text-sky-700" />
                <h3 className="mt-5 text-lg font-semibold">{card.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="light-card rounded-[2rem] p-6">
              <div className="flex items-center gap-3 text-slate-500">
                <Database className="h-5 w-5 text-sky-700" />
                <span className="text-xs tracking-[0.28em] uppercase">Core pillars</span>
              </div>
              <div className="mt-6 space-y-4">
                {architecturePillars.map((pillar) => (
                  <div key={pillar} className="rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-700">
                    {pillar}
                  </div>
                ))}
              </div>
            </div>
            <div className="light-card rounded-[2rem] p-6">
              <div className="flex items-center gap-3 text-slate-500">
                <Activity className="h-5 w-5 text-emerald-700" />
                <span className="text-xs tracking-[0.28em] uppercase">Why this matters</span>
              </div>
              <div className="mt-6 grid gap-4">
                {[
                  "Scalability is demonstrated through isolated service responsibilities and independent health signals.",
                  "Fault isolation is reflected in the separate payment outcome flow and notification independence.",
                  "Observability is built into the experience through metrics cards, request trails, and service health panels.",
                  "Academic clarity is preserved with a dedicated supervisor and researcher showcase presented as part of the product story.",
                ].map((statement) => (
                  <div key={statement} className="rounded-2xl bg-slate-950 px-5 py-4 text-sm leading-7 text-slate-300">
                    {statement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a1321]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.28em] text-sky-200 uppercase">Supervisor and researchers</p>
            <h2 className="font-display mt-3 text-4xl text-white md:text-5xl">
              The academic team behind the work is part of the homepage experience.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-4">
            {[supervisor, ...researchers].map((member) => (
              <div key={member.name} className="section-card rounded-[2rem] p-5">
                <div className="relative h-72 overflow-hidden rounded-[1.5rem]">
                  <Image src={member.imageUrl} alt={member.name} fill className="object-cover" sizes="(min-width: 1280px) 25vw, 100vw" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-5">
                    <p className="text-xs tracking-[0.24em] text-sky-200 uppercase">{member.role}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{member.name}</h3>
                    {member.matricNumber ? (
                      <p className="mt-1 text-sm text-slate-200">Matric no: {member.matricNumber}</p>
                    ) : null}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
