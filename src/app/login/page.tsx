"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import AuthInputField from "@/components/auth/AuthInputField";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { api, getApiErrorMessage } from "@/constants/constants";
import { persistAuthSession } from "@/constants/authProxy";
import { useRouter } from "next/navigation";

function LoginContent() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawFrom = searchParams.get("from") ?? "";
  const redirectTo =
    rawFrom.startsWith("/") && !rawFrom.startsWith("//") ? rawFrom : "/feed";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: NonNullable<React.ComponentProps<"form">["onSubmit"]> = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      if (res.status >= 200 && res.status < 300) {
        persistAuthSession(res.data);
        router.push(redirectTo);
      }
    } catch (error) {
      setError(getApiErrorMessage(error, "An error occured. Please try again."));
    } finally {
      setLoading(false);
    }
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
            Don&apos;t have an account?{" "}
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
      </form>
    </AuthSplitLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
