"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Firebase Auth State Changed:', user ? `Logged in: ${user.email}` : 'Not logged in');
      console.log('📍 Current pathname:', pathname);
      
      setUser(user);
      setLoading(false);

      // หน้าที่ไม่ต้องล็อกอิน
      const publicPaths = ['/signin', '/signup'];
      const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

      if (!user && !isPublicPath) {
        // ไม่มี user และไม่ได้อยู่ในหน้า public -> redirect ไป signin
        console.log('🔄 Redirecting to signin - no user found');
        router.push('/signin');
      } else if (user && isPublicPath) {
        // มี user และอยู่ในหน้า auth -> redirect ไปหน้าหลัก
        console.log('🔄 Redirecting to home - user already logged in');
        router.push('/');
      }
    });

    return unsubscribe;
  }, [router, pathname]);

  // แสดง loading ขณะตรวจสอบ auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // หน้าที่ไม่ต้องล็อกอิน
  const publicPaths = ['/signin', '/signup'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // ถ้าไม่มี user และไม่ได้อยู่ในหน้า public -> แสดง loading
  if (!user && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}