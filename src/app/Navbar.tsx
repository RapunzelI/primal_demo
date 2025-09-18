"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

// icons
import { IoMenu } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { GoHome } from "react-icons/go";
import { IoIosGitCompare } from "react-icons/io";
import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { TbLayoutDashboard } from "react-icons/tb";
import { FaArrowUp } from "react-icons/fa6";

export default function Navbar() {
  const [isSideMenuOpen, setSideMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const openSideMenu = () => setSideMenu(true);
  const closeSideMenu = () => setSideMenu(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Navbar Container */}
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Top Navbar */}
        <nav
          className="h-24 md:p-2.5 sm:p-4 md:flex md:justify-between md:items-center bg-[#373995] relative z-10"
          suppressHydrationWarning
        >
          {isSideMenuOpen && <MobileNav closeSideMenu={closeSideMenu} />}
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="logo xl:mr-auto xl:ml-10">
              <Image
                src="/logo.png"
                alt="Website Logo"
                width={30}
                height={30}
                priority
              />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex ml-auto">
              <div className="flex justify-center">
                <div className="flex text-center whitespace-nowrap gap-10 font-medium py-4 text-white mr-10">
                  <Link className="navbar_link relative" href="/learning">
                    สื่อการสอน
                  </Link>
                  <Link className="navbar_link relative" href="/account">
                    ลงทะเบียนนักเรียน
                  </Link>
                  <Link className="navbar_link relative" href="/dashboard">
                    รายงานพัฒนา
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <IoMenu
              onClick={openSideMenu}
              className="cursor-pointer text-4xl md:hidden text-white"
            />
          </div>
        </nav>

        {/* SVG Decoration - ปรับให้กว้างเต็มหน้าจอและไม่มีช่องว่าง */}
        <div className="absolute top-24 left-0 w-full z-0 pointer-events-none overflow-hidden">
          <Image
            src="/assets/Navbar.svg"
            alt="Navbar Decoration"
            width={1920}
            height={150}
            className="block w-full h-auto min-w-full object-cover"
            style={{ 
              width: '100vw', 
              minWidth: '100%',
              maxWidth: 'none'
            }}
          />
        </div>
      </div>

      {/* Spacer - เพิ่มความสูงให้เท่ากับ navbar เท่านั้น */}
      <div className="h-24"></div>

      {/* Scroll-to-top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="btnup fixed bottom-5 right-5 bg-black text-white p-3 rounded-full shadow-lg hover:bg-[#f2dfcf] hover:text-[#a087c6] transition-all z-40"
          title="เลื่อนขึ้นด้านบน"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
}

interface MobileNavProps {
  closeSideMenu: () => void;
}

function MobileNav({ closeSideMenu }: MobileNavProps) {
  return (
    <div className="fixed left-0 top-0 z-[10000] flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden">
      <div className="h-full w-[65%] bg-white px-4 py-4 relative z-50">
        <div className="flex justify-end">
          <AiOutlineClose
            onClick={closeSideMenu}
            className="cursor-pointer text-4xl"
          />
        </div>
        <div className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col gap-4 ml-[15px]">
            <Link
              className="navbar_link relative flex flex-row items-center space-x-2"
              href="/"
              onClick={closeSideMenu}
            >
              <GoHome />
              <span>หน้าหลัก</span>
            </Link>
            <Link
              className="navbar_link relative flex flex-row items-center space-x-2"
              href="/learning"
              onClick={closeSideMenu}
            >
              <TbLayoutDashboard />
              <span>สื่อการสอน</span>
            </Link>
            <Link
              className="navbar_link relative flex flex-row items-center space-x-2"
              href="/account"
              onClick={closeSideMenu}
            >
              <IoIosGitCompare />
              <span>ลงทะเบียนนักเรียน</span>
            </Link>
            <Link
              className="navbar_link relative flex flex-row items-center space-x-2"
              href="/dashboard"
              onClick={closeSideMenu}
            >
              <AiOutlineDeploymentUnit />
              <span>รายงานพัฒนา</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}