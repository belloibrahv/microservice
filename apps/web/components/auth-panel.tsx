"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SyntheticEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { User } from "@/lib/types";
import { useAppStore } from "@/stores/use-app-store";

type SessionResponse = {
  token: string;
  user: Omit<User, "password">;
};

export function AuthPanel({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const setSession = useAppStore((state) => state.setSession);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Use admin@retail-demo.cloud / Admin@12345 for demo admin access.");
  const [pending, setPending] = useState(false);

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);

    try {
      const endpoint = mode === "sign-in" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "sign-in"
          ? { email, password }
          : { fullName, email, password };
      const data = await apiRequest<SessionResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSession(data.token, data.user);
      setMessage(mode === "sign-in" ? "Welcome back." : "Registration complete.");
      router.push(mode === "sign-in" ? "/catalog" : "/checkout");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="bg-[#0a1321] px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="section-card rounded-[2rem] p-8">
          <p className="text-xs tracking-[0.28em] text-sky-200 uppercase">
            Authentication service
          </p>
          <h1 className="font-display mt-4 text-5xl text-white">
            {mode === "sign-in" ? "Sign in to place and track orders." : "Create your demo customer account."}
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            The gateway secures protected workflows, while the identity service manages users and issues demo access tokens for the application experience.
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <div className="flex items-center gap-3 text-sky-200">
              <ShieldCheck className="h-5 w-5" />
              <span>Role-aware demo access</span>
            </div>
            <p className="mt-4 leading-7">{message}</p>
          </div>
        </div>

        <form onSubmit={submit} className="light-card rounded-[2rem] p-8 text-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                {mode === "sign-in" ? "Sign in" : "Sign up"}
              </p>
              <h2 className="font-display mt-3 text-4xl">
                {mode === "sign-in" ? "Return to the platform." : "Start exploring the platform."}
              </h2>
            </div>
            <Link
              href={mode === "sign-in" ? "/auth/sign-up" : "/auth/sign-in"}
              className="text-sm text-sky-700"
            >
              {mode === "sign-in" ? "Need an account?" : "Already registered?"}
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            {mode === "sign-up" ? (
              <label className="block">
                <span className="text-sm font-medium">Full name</span>
                <input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
                />
              </label>
            ) : null}
            <label className="block">
              <span className="text-sm font-medium">Email address</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {pending ? "Processing..." : mode === "sign-in" ? "Sign in" : "Create account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
