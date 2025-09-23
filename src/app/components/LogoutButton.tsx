"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // ปรับ path ให้ถูกต้อง
import { IoLogOut } from "react-icons/io5";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
  try {
    setIsLoggingOut(true);
    
    // Sign out จาก Firebase
    await signOut(auth);
    
    // ลบข้อมูลจาก localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDisplayName');
    localStorage.removeItem('userPhotoURL');
    localStorage.removeItem('userId');
    
    // ส่ง event เพื่อแจ้งให้ components อื่นรู้ว่ามีการ logout
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Redirect ไปหน้า signin
    router.push('/signin');
    
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setIsLoggingOut(false);
  }
};


  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 w-full ${
        isLoggingOut
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-md'
      }`}
    >
      <IoLogOut className="text-lg" />
      <span className="text-sm font-medium">
        {isLoggingOut ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
      </span>
    </button>
  );
}