"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useSearchParams } from "next/navigation";

function toThaiAuthMessage(code?: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    case "auth/user-not-found":
      return "ไม่พบบัญชีผู้ใช้นี้";
    case "auth/invalid-email":
      return "รูปแบบอีเมลไม่ถูกต้อง";
    default:
      return "ไม่สามารถดำเนินการได้";
  }
}
export default function SignInPage() {
  const router = useRouter(); 
  const searchParams = useSearchParams();             
  const justRegistered = searchParams.get("registered") === "1";

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const disabled = authing || !email || !password;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    try {
      setError("");
      setAuthing(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("login uid:", res.user.uid);
      router.push("/"); // ล็อกอินสำเร็จ -> กลับหน้าแรก
    } catch (err: any) {
      setError(toThaiAuthMessage(err?.code));
    } finally {
      setAuthing(false);
    }
  };

  return (
     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* แถบแจ้งเตือนเมื่อเพิ่งสมัครเสร็จ */}
        {justRegistered && (
          <div className="mb-4 text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
            สมัครสมาชิกสำเร็จแล้ว กรุณาเข้าสู่ระบบ
          </div>
          )}
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">🔐</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Sign in</h1>
          </div>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none px-4 py-3"
                required
              />
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden
              >
                ✉️
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none px-4 py-3 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label="toggle password visibility"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={disabled}
            className={`w-full rounded-full py-3 text-white font-semibold transition ${
              disabled
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:brightness-110 active:scale-[.99]"
            }`}
          >
            {authing ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-slate-500 text-center pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign up here!
            </Link>
          </p>
        </form>
      </div>
    </div>
    </div>
    </div>
  );
}