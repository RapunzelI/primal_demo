"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useSearchParams } from "next/navigation";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosLock } from "react-icons/io";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Image from "next/image"; // import SVG component

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
      
      // เก็บข้อมูลผู้ใช้ใน localStorage
      const user = res.user;
      localStorage.setItem('authToken', await user.getIdToken());
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userDisplayName', user.displayName || '');
      localStorage.setItem('userPhotoURL', user.photoURL || '');
      localStorage.setItem('userId', user.uid);
      
      // สร้าง event เพื่อแจ้งให้ Navbar รู้ว่ามีการเปลี่ยนแปลงสถานะ login
      window.dispatchEvent(new Event('authStateChanged'));
      
      router.push("/");
    } catch (err: any) {
      setError(toThaiAuthMessage(err?.code));
    } finally {
      setAuthing(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white">
      {/* Background Banner SVG */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute right-0 w-10 md:w-160 xl:w-220 h-full pointer-events-none overflow-hidden">
          <Image
            src="/Banner.svg"
            alt="Background Banner"
            width={1920}
            height={1117}
            className="block w-full h-full object-cover object-left"
            style={{ 
              width: '100%', 
              height: '100%'
            }}
          />
        </div>
      </div>

      {/* Success notification */}
      {justRegistered && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md">
          <div className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
            สมัครสมาชิกสำเร็จแล้ว กรุณาเข้าสู่ระบบ
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="z-10 min-h-screen flex">
        
        {/* Left Side - Login Form */}
        <div className="flex-1 lg:flex-none lg:w-1/2 flex flex-col justify-center px-4 py-12 lg:px-25 xl:px-30">
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-0 xl:ml-8">
            
            {/* Logo */}
            <div className="mb-8">
              <Image 
                src="/logo_login.png" 
                alt="Logo" 
                width={60} 
                height={60}
                className="object-contain"
              />
            </div>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Sign in</h1>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              
              {/* Email Field */}
              <div className="space-y-2 z-60">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <HiOutlineMail size={20} />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full z-60 pl-12 pr-4 py-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-600 transition-colors duration-200 text-gray-700"
                    required
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <IoIosLock size={20} />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Password"
                    className="w-full z-40 pl-12 pr-12 py-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-600 transition-colors duration-200 text-gray-700"
                    required
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute z-40 right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="toggle password visibility"
                    suppressHydrationWarning
                  >
                    {showPass ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="w-4 h-4 z-40 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="ml-3 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button 
                  type="button"
                  className="z-40 text-sm text-gray-500 hover:text-gray-700"
                  suppressHydrationWarning
                >
                  Forgot Password ?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50/80 border border-red-200 rounded-lg p-3 mt-4">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={disabled}
                suppressHydrationWarning
                className={`w-full mt-8 py-4 rounded-full font-semibold text-white transition-all duration-200 text-lg ${
                  disabled
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg hover:shadow-xl"
                }`}
              >
                {authing ? "Signing in..." : "Login"}
              </button>

              {/* Register Link */}
              <div className="text-center pt-6 text-gray-600">
                <p className="text-sm mb-1">
                  If you don&apos;t have an account register
                </p>
                <p className="text-sm">
                  You can{" "}
                  <Link href="/signup" className="z-40 text-black font-bold hover:underline">
                    Register here !
                  </Link>
                </p>
              </div>
              
            </form>
          </div>
        </div>

        {/* Right Side - 3D Character */}
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