"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosLock } from "react-icons/io";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Image from "next/image";

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
      router.push("/signin?registered=1");
    } catch (err: any) {
      setError(toThaiAuthMessage(err?.code));
    } finally {
      setAuthing(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white">
      {/* Background Banner */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute right-0 w-10 md:w-160 xl:w-220 h-full pointer-events-none overflow-hidden">
          <Image
            src="/Banner.svg"
            alt="Background Banner"
            width={1920}
            height={1117}
            className="block w-full h-full object-cover object-left"
          />
        </div>
      </div>

      <div className="z-10 min-h-screen flex">
        {/* Left - Form */}
        <div className="flex-1 lg:flex-none lg:w-1/2 flex flex-col justify-center px-4 py-12 lg:px-25 xl:px-30">
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-0 xl:ml-8">
            {/* Logo */}
            <div className="mb-8">
              <Image src="/logo_login.png" alt="Logo" width={60} height={60} />
            </div>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Sign Up</h1>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <HiOutlineMail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 text-gray-700"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <IoIosLock size={20} />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 text-gray-700"
                    required
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    suppressHydrationWarning
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <IoIosLock size={20} />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-12 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 text-gray-700"
                    required
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    suppressHydrationWarning
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirm ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match.</p>
                )}
              </div>

              {/* Error */}
              {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

              {/* Submit */}
              <button
                type="submit"
                disabled={disabled}
                suppressHydrationWarning
                className={`w-full mt-8 py-4 rounded-full font-semibold text-white ${
                  disabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {authing ? "Signing up..." : "Sign Up"}
              </button>

              {/* Login Link */}
              <p className="text-center pt-6 text-gray-600">
                Already have an account?{" "}
                <Link href="/signin" className="text-black font-bold hover:underline">
                  Login here!
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right - 3D Character */}
        <div className="hidden lg:flex flex-1 items-end justify-center relative">
          <div className="relative z-20 mb-0">
            <Image
              src="/login_person.png"
              alt="3D Character"
              width={500}
              height={500}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

