"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  UserRound,
  KeyRound,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import AuthInputField from "@/components/auth/AuthInputField";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { AxiosError } from "axios";
import { api, ApiErrorData } from "@/constants/constants";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post('/auth/register', form)
      if (res.status === 201) {
        setSuccess(res.data.message)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
        
      }
    } catch (e) {
      setError((e as AxiosError<ApiErrorData>).response?.data.message || 'An error occured. Please try again.')
      setLoading(false)
    }
  };

  return (
    <AuthSplitLayout
      accentIcon={Sparkles}
      leftBadge="Get Started"
      leftTitle={
        <>
          Join the <br />
          Community. <br />
          Improve faster.
        </>
      }
      leftDescription={
        "Create your account to rate profiles and earn points to post your own."
      }
      highlights={[
        { icon: <ShieldCheck size={18} />, text: "Verified account" },
        { icon: <ArrowRight size={18} />, text: "Community feedback" },
      ]}
      rightTitle="Create Account"
      rightSubtitle="Set up your profile"
      footerClassName="mt-10 border-t border-gray-100 pt-8 text-center space-y-4"
      footer={
        <>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-black text-indigo-600 transition-colors hover:text-indigo-800"
            >
              Sign in
            </Link>
          </p>
          <Link
            href="/"
            className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 transition-colors hover:text-gray-600"
          >
            Back to landing
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInputField
          label="Username"
          icon={UserRound}
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="username"
          wrapperClassName="px-4 py-3.5"
        />
        <AuthInputField
          label="Email"
          icon={Mail}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="you@mail.com"
          wrapperClassName="px-4 py-3.5"
        />
        <AuthInputField
          label="Password"
          icon={KeyRound}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
          placeholder="At least 8 characters"
          wrapperClassName="px-4 py-3.5"
        />

        {error ? (
          <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3 text-rose-600">
            <AlertCircle size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest leading-tight">
              {error}
            </span>
          </div>
        ) : null}

        {success ? (
          <div className="flex items-center gap-3 rounded-xl border-emerald-100 bg-emerald-50 p-3 text-emerald-600">
            <AlertCircle size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest leading-tight">
              {success}
            </span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-950 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-900 disabled:bg-gray-200"
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin" size={14} />
              Creating account...
            </>
          ) : (
            "Sign up"
          )}
        </button>
      </form>
    </AuthSplitLayout>
  );
}
