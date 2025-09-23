"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // หน้าที่ไม่ต้องแสดง Navbar
  const hideNavbarPaths = ['/signin', '/signup'];
  const shouldHideNavbar = hideNavbarPaths.some(path => pathname?.startsWith(path));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}