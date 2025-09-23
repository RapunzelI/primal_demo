"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // ปรับ path ให้ถูกต้อง

// icons
import { IoMenu } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { GoHome } from "react-icons/go";
import { IoIosGitCompare } from "react-icons/io";
import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { TbLayoutDashboard } from "react-icons/tb";
import { FaArrowUp } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const [isSideMenuOpen, setSideMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [profileDropdownTimeout, setProfileDropdownTimeout] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");
  const [userPhotoURL, setUserPhotoURL] = useState("");
  const pathname = usePathname();

  const openSideMenu = () => setSideMenu(true);
  const closeSideMenu = () => setSideMenu(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ตรวจสอบสถานะการเข้าสู่ระบบจาก Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || "");
        setUserDisplayName(user.displayName || "");
        setUserPhotoURL(user.photoURL || "");
        
        // เก็บข้อมูลใน localStorage (สำรอง)
        localStorage.setItem('authToken', user.refreshToken);
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userDisplayName', user.displayName || '');
        localStorage.setItem('userPhotoURL', user.photoURL || '');
        localStorage.setItem('userId', user.uid);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
        setUserDisplayName("");
        setUserPhotoURL("");
        
        // ล้างข้อมูลใน localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userDisplayName');
        localStorage.removeItem('userPhotoURL');
        localStorage.removeItem('userId');
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // ตรวจสอบ event จาก signin page
  useEffect(() => {
    const handleAuthStateChanged = () => {
      // รีเฟรชข้อมูลเมื่อมีการเปลี่ยนแปลงสถานะ
      const email = localStorage.getItem('userEmail');
      const displayName = localStorage.getItem('userDisplayName');
      const photoURL = localStorage.getItem('userPhotoURL');
      const token = localStorage.getItem('authToken');
      
      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
        setUserDisplayName(displayName || "");
        setUserPhotoURL(photoURL || "");
      }
    };

    window.addEventListener('authStateChanged', handleAuthStateChanged);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, []);

  // ตรวจสอบว่าเป็น touch device หรือไม่
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
  }, []);

  // Handle สื่อการสอน dropdown
  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    const timeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
    setDropdownTimeout(timeout);
  };

  const handleDropdownClick = (e) => {
    e.preventDefault();
    if (isTouchDevice) {
      setDropdownOpen(!isDropdownOpen);
    }
  };

  // Handle Profile dropdown
  const handleProfileMouseEnter = () => {
    if (isTouchDevice) return;
    if (profileDropdownTimeout) {
      clearTimeout(profileDropdownTimeout);
      setProfileDropdownTimeout(null);
    }
    setProfileDropdownOpen(true);
  };

  const handleProfileMouseLeave = () => {
    if (isTouchDevice) return;
    const timeout = setTimeout(() => {
      setProfileDropdownOpen(false);
    }, 200);
    setProfileDropdownTimeout(timeout);
  };

  const handleProfileDropdownClick = (e) => {
    e.preventDefault();
    if (isTouchDevice) {
      setProfileDropdownOpen(!isProfileDropdownOpen);
    }
  };

  // ปิด dropdown เมื่อคลิกที่อื่น
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isTouchDevice && (isDropdownOpen || isProfileDropdownOpen)) {
        const dropdown = event.target.closest('.dropdown-container');
        const profileDropdown = event.target.closest('.profile-dropdown-container');
        if (!dropdown && !profileDropdown) {
          setDropdownOpen(false);
          setProfileDropdownOpen(false);
        }
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isTouchDevice, isDropdownOpen, isProfileDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
      if (profileDropdownTimeout) {
        clearTimeout(profileDropdownTimeout);
      }
    };
  }, [dropdownTimeout, profileDropdownTimeout]);

  // สร้าง initials จากชื่อหรือ email
  const getInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
    {/* Fixed Navbar Container */}
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Top Navbar */}
        <nav
          className="h-24 md:p-2.5 sm:p-4 md:flex md:justify-between md:items-center bg-[#373995] relative z-10"
          suppressHydrationWarning
        >
          {isSideMenuOpen && <MobileNav closeSideMenu={closeSideMenu} isLoggedIn={isLoggedIn} userEmail={userEmail} userDisplayName={userDisplayName} userPhotoURL={userPhotoURL} />}
          <div className="container mx-auto flex justify-between items-center h-full px-4 md:px-0">
            {/* Logo - เพิ่ม margin และ padding สำหรับมือถือ */}
            <Link href="/" className="logo xl:mr-auto xl:ml-10 flex items-center">
              <Image
                src="/logo.png"
                alt="Website Logo"
                width={30}
                height={30}
                priority
                className="ml-2 md:ml-0"
              />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex ml-auto">
              <div className="flex justify-center">
                <div className="flex text-center whitespace-nowrap gap-10 font-medium py-4 text-white mr-10">
                  {/* Dropdown สื่อการสอน */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    suppressHydrationWarning
                  >
                    <button 
                      className="navbar_link relative flex items-center gap-1 hover:text-gray-200 transition-colors"
                      onClick={handleDropdownClick}
                      suppressHydrationWarning
                    >
                      สื่อการสอน
                      <IoIosArrowDown 
                        className={`transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-black/60 bg-opacity-80 rounded-lg shadow-lg overflow-hidden z-50">
                        <Link
                          href="/learning/content"
                          className="block px-4 py-3 text-white hover:text-black hover:bg-white/60 hover:bg-opacity-20 transition-colors border-b border-gray-600 text-center"
                        >
                          <div className="flex items-center justify-center gap-2">
                            เนื้อหา
                          </div>
                        </Link>
                        <Link
                          href="/learning/games"
                          className="block px-4 py-3 text-white hover:text-black hover:bg-white/60 hover:bg-opacity-20 transition-colors text-center"
                        >
                          <div className="flex items-center justify-center gap-2">
                            เกม
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link 
                    className={`navbar_link relative group ${
                      pathname === '/account' 
                        ? 'text-white' 
                        : 'hover:text-gray-200'
                    } transition-colors`} 
                    href="/account"
                  >
                    ลงทะเบียนนักเรียน
                    <span 
                      className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                        pathname === '/account' 
                          ? 'w-full' 
                          : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </Link>
                  <Link 
                    className={`navbar_link relative group ${
                      pathname === '/dashboard' 
                        ? 'text-white' 
                        : 'hover:text-gray-200'
                    } transition-colors`} 
                    href="/dashboard"
                  >
                    รายงานพัฒนา
                    <span 
                      className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                        pathname === '/dashboard' 
                          ? 'w-full' 
                          : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </Link>
                  
                  {/* Profile Section - แสดงตามสถานะการเข้าสู่ระบบ */}
                  {isLoggedIn ? (
                    <div 
                      className="relative profile-dropdown-container"
                      onMouseEnter={handleProfileMouseEnter}
                      onMouseLeave={handleProfileMouseLeave}
                    >
                      <button 
                        className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                        onClick={handleProfileDropdownClick}
                      >
                        {/* Profile Image */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                          {userPhotoURL ? (
                            <Image 
                              src={userPhotoURL} 
                              alt="Profile" 
                              width={32} 
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[#373995] text-sm font-semibold">
                              {getInitials(userDisplayName, userEmail)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm max-w-32 truncate">
                          {userDisplayName || userEmail}
                        </span>
                        <IoIosArrowDown 
                          className={`transition-transform duration-200 ${
                            isProfileDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {/* Profile Dropdown Menu */}
                      {isProfileDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-black/60 bg-opacity-80 rounded-lg shadow-lg overflow-hidden z-50">
                          <div className="px-4 py-3 border-b border-gray-600">
                            <div className="text-white text-sm font-medium truncate">{userDisplayName || 'ผู้ใช้'}</div>
                            <div className="text-gray-300 text-xs truncate">{userEmail}</div>
                          </div>
                          <Link
                            href="/profile"
                            className="block px-4 py-3 text-white hover:text-black hover:bg-white/60 hover:bg-opacity-20 transition-colors"
                          >
                            โปรไฟล์
                          </Link>
                          <Link
                            href="/settings"
                            className="block px-4 py-3 text-white hover:text-black hover:bg-white/60 hover:bg-opacity-20 transition-colors border-b border-gray-600"
                          >
                            ตั้งค่า
                          </Link>
                          <div className="px-4 py-3">
                            <LogoutButton />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/signin"
                      className="rounded-lg bg-white text-[#373995] px-4 py-2 font-semibold hover:brightness-95 transition"
                    >
                      เข้าสู่ระบบ
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button - เพิ่ม margin สำหรับมือถือ */}
            <IoMenu
              onClick={openSideMenu}
              className="cursor-pointer text-4xl md:hidden text-white mr-2"
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
          className="btnup fixed bottom-5 right-5 bg-[#373995] text-white p-3 rounded-full shadow-lg hover:bg-[#ffffff] hover:text-[#373995] transition-all z-40"
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
  isLoggedIn: boolean;
  userEmail: string;
  userDisplayName: string;
  userPhotoURL: string;
}

function MobileNav({ closeSideMenu, isLoggedIn, userEmail, userDisplayName, userPhotoURL }: MobileNavProps) {
  const [isLearningExpanded, setLearningExpanded] = useState(false);

  // สร้าง initials จากชื่อหรือ email
  const getInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="fixed left-0 top-0 z-[10000] flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden">
      <div className="h-full w-[65%] bg-white px-4 py-4 relative z-50">
        <div className="flex justify-end">
          <AiOutlineClose
            onClick={closeSideMenu}
            className="cursor-pointer text-4xl text-black"
          />
        </div>
        <div className="flex flex-col gap-6 mt-6">
          {/* Profile Section สำหรับ Mobile */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 ml-[15px] pb-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#373995] flex items-center justify-center">
                {userPhotoURL ? (
                  <Image 
                    src={userPhotoURL} 
                    alt="Profile" 
                    width={40} 
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {getInitials(userDisplayName, userEmail)}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{userDisplayName || 'ผู้ใช้'}</span>
                <span className="text-xs text-gray-600 truncate max-w-32">{userEmail}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 ml-[15px]">
            <Link
              className="navbar_link relative flex flex-row items-center space-x-2 text-black"
              href="/"
              onClick={closeSideMenu}
            >
              <GoHome className="text-black" />
              <span>หน้าหลัก</span>
            </Link>

            {/* สื่อการสอน with Expandable Menu */}
            <div className="flex flex-col">
              <button
                className="navbar_link relative flex flex-row items-center justify-between text-black w-full"
                onClick={() => setLearningExpanded(!isLearningExpanded)}
              >
                <div className="flex items-center space-x-2">
                  <TbLayoutDashboard className="text-black" />
                  <span>สื่อการสอน</span>
                </div>
                <IoIosArrowDown 
                  className={`transition-transform duration-200 ${
                    isLearningExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expandable Sub-menu */}
              {isLearningExpanded && (
                <div className="ml-8 mt-2 flex flex-col gap-2 border-l-2 border-gray-200 pl-4">
                  <Link
                    className="flex items-center space-x-2 text-gray-700 py-2 hover:text-[#373995] transition-colors"
                    href="/learning/content"
                    onClick={closeSideMenu}
                  >
                    <span>เนื้อหา</span>
                  </Link>
                  <Link
                    className="flex items-center space-x-2 text-gray-700 py-2 hover:text-[#373995] transition-colors"
                    href="/learning/games"
                    onClick={closeSideMenu}
                  >
                    <span>เกม</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              className="navbar_link relative flex flex-row items-center space-x-2 text-black"
              href="/account"
              onClick={closeSideMenu}
            >
              <IoIosGitCompare className="text-black" />
              <span>ลงทะเบียนนักเรียน</span>
            </Link>
            <Link
              className="navbar_link relative flex flex-row items-center space-x-2 text-black"
              href="/dashboard"
              onClick={closeSideMenu}
            >
              <AiOutlineDeploymentUnit className="text-black" />
              <span>รายงานพัฒนา</span>
            </Link>

            {/* Profile Links สำหรับ Mobile */}
            {isLoggedIn ? (
              <>
                <Link
                  className="navbar_link relative flex flex-row items-center space-x-2 text-black"
                  href="/profile"
                  onClick={closeSideMenu}
                >
                  <IoPerson className="text-black" />
                  <span>โปรไฟล์</span>
                </Link>
                <Link
                  className="navbar_link relative flex flex-row items-center space-x-2 text-black"
                  href="/settings"
                  onClick={closeSideMenu}
                >
                  <IoPerson className="text-black" />
                  <span>ตั้งค่า</span>
                </Link>
                <div className="pt-2">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <Link 
                className="navbar_link relative flex flex-row items-center justify-center space-x-2 bg-[#373995] text-white rounded-xl px-4 py-3" 
                href="/signin" 
                onClick={closeSideMenu}
              >               
                <IoPerson />               
                <span>เข้าสู่ระบบ</span>             
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}