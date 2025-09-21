"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
export default function SignUpPage() {
  const router = useRouter();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const disabled = authing || !email || !password || !confirmPassword;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setAuthing(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("created uid:", res.user.uid);
       router.push("/signin?registered=1"); // เด้งไปหน้าล็อกอิน
    } catch (err: any) {
      setError(toThaiAuthMessage(err?.code));
    } finally {
      setAuthing(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">📚</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Sign up</h1>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none px-4 py-3 pr-10"
                required
                minLength={6}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none px-4 py-3 pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label="toggle confirm password visibility"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-600">Passwords do not match.</p>
            )}
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
            className={`w-full rounded-full py-3 text-white font-semibold transition
              ${disabled ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:brightness-110 active:scale-[.99]"}`}
          >
            {authing ? "Signing up..." : "Sign up"}
          </button>

          <p className="text-xs text-slate-500 text-center pt-2">
            Already have an account?{" "}
            <Link href="/signin" className="text-indigo-600 font-medium hover:underline">
              Login here!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
