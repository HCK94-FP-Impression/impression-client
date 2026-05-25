"use client";

import { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import AuthInputField from "@/components/auth/AuthInputField";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <AuthSplitLayout
      accentIcon={ShieldCheck}
      leftBadge="Sign In"
      leftTitle="Welcome back"
      leftDescription="Sign in to rate profiles and earn points."
      highlights={[{ icon: <ShieldCheck size={16} />, text: "Secure login" }]}
      rightTitle="Sign in to your account"
      rightSubtitle="Enter your email and password"
      footer={
        <div className="space-y-3">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
          <Link
            href="/"
            className="block text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-gray-900 transition-colors"
          >
            Back to home
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <AuthInputField
            label="Email"
            icon={Mail}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
          <AuthInputField
            label="Password"
            icon={KeyRound}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        {error ? (
          <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3 text-rose-600">
            <AlertCircle size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest leading-tight">
              {error}
            </span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-950 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-indigo-950/10 transition-all active:scale-95 disabled:bg-gray-200"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" size={14} />
          ) : (
            "Sign in"
          )}
        </button>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="flex justify-center rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-700"
            >
              G<span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
