"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// icons
import { IoMenu } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { GoHome } from "react-icons/go";
import { IoIosGitCompare } from "react-icons/io";
import { AiOutlineDeploymentUnit, AiOutlineProduct } from "react-icons/ai";
import { TbLayoutDashboard } from "react-icons/tb";
import { FaArrowUp } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

// Types
interface KnowledgeItem {
  id: string;
  title: string;
  categories?: string[];
}

interface Ingredient {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
}

interface SearchResults {
  knowledge: KnowledgeItem[];
  ingredients: Ingredient[];
  products: Product[];
}

export default function Navbar() {
  const [isSideMenuOpen, setSideMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResults>({
    knowledge: [],
    ingredients: [],
    products: [],
  });

  function openSideMenu() {
    setSideMenu(true);
  }

  function closeSideMenu() {
    setSideMenu(false);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        fetch(`http://localhost:8080/search/${encodeURIComponent(searchTerm)}`)
          .then((res) => res.json())
          .then((data: SearchResults) => setResults(data))
          .catch((err) => console.error(err));
      } else {
        setResults({ knowledge: [], ingredients: [], products: [] });
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <>
      {/* Fixed Navbar Container - รวม navbar และ SVG เป็นหนึ่งเดียวกัน */}
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Top Navbar */}
        <nav className="h-24 md:p-2.5 sm:p-4 md:flex md:justify-between md:items-center bg-[#373995] shadow-md" suppressHydrationWarning>
          {isSideMenuOpen && (
            <MobileNav
              closeSideMenu={closeSideMenu}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              results={results}
            />
          )}

          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="logo xl:mr-auto xl:ml-10" suppressHydrationWarning>
              <Image
                src="/logo.png"
                alt="Website Logo"
                width={30}
                height={30}
              />
            </a>

            <div className="hidden md:flex ml-auto">
              <div className="container flex justify-center">
                <div className="flex text-center whitespace-nowrap gap-10 font-medium py-4 text-white mr-10">
                  <Link className="navbar_link relative" href="/learning">สื่อการสอน</Link>
                  <Link className="navbar_link relative" href="/compare">ลงทะเบียนนักเรียน</Link>
                  <Link className="navbar_link relative" href="/ingredients">รายงานพัฒนา</Link>
                </div>
              </div>
            </div>

            <IoMenu onClick={openSideMenu} className="cursor-pointer text-4xl md:hidden text-white" />
          </div>
        </nav>

        {/* SVG Decoration - ติดกับ navbar */}
        <div className="w-full">
          <img src="/assets/Navbar.svg" className="block w-full h-auto" />
        </div>
      </div>

      {/* Spacer เพื่อป้องกันเนื้อหาไปซ้อนกับ fixed navbar */}
      <div className="h-32"></div>

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

function MobileNav({
  closeSideMenu,
  searchTerm,
  setSearchTerm,
  results,
}: {
  closeSideMenu: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  results: SearchResults;
}) {
  return (
    <div className="fixed left-0 top-0 z-[10000] flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden">
      <div className="h-full w-[65%] bg-white px-4 py-4 relative z-50">
        <div className="flex justify-end">
          <AiOutlineClose onClick={closeSideMenu} className="cursor-pointer text-4xl" />
        </div>
        <div className="flex flex-col gap-6 mt-6">
          <div className="w-full relative">
            <input
              className="search focus:outline-[#b8a5d5] border-gray-300 border p-2 px-10 rounded-full w-full shadow-sm"
              suppressHydrationWarning
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />

            {(results.knowledge.length || results.ingredients.length || results.products.length) > 0 && (
              <SearchDropdown 
                results={results} 
                setSearchTerm={setSearchTerm} 
                closeSideMenu={closeSideMenu}
              />
            )}
          </div>

          <div className="flex flex-col gap-4 ml-[15px]">
            <Link 
              className="navbar_link relative flex flex-row items-center space-x-2" 
              href="/"
              onClick={closeSideMenu}
            >
              <GoHome /><span>หน้าหลัก</span>
            </Link>
            <Link 
              className="navbar_link relative flex flex-row items-center space-x-2" 
              href="/learning"
              onClick={closeSideMenu}
            >
              <TbLayoutDashboard /><span>สื่อการสอน</span>
            </Link>
            <Link 
              className="navbar_link relative flex flex-row items-center space-x-2" 
              href="/compare"
              onClick={closeSideMenu}
            >
              <IoIosGitCompare /><span>ลงทะเบียนนักเรียน</span>
            </Link>
            <Link 
              className="navbar_link relative flex flex-row items-center space-x-2" 
              href="/ingredients"
              onClick={closeSideMenu}
            >
              <AiOutlineDeploymentUnit /><span>รายงานพัฒนา</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchDropdown({
  results,
  setSearchTerm,
  closeSideMenu
}: {
  results: SearchResults;
  setSearchTerm: (val: string) => void;
  closeSideMenu: () => void;
}) {
  const router = useRouter();

  const handleClick = (href: string) => {
    setSearchTerm("");
    closeSideMenu(); // Close the mobile menu when item is selected
    router.push(href);
  };

  return (
    <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
      {results.knowledge.map((k) => (
        <button
          key={k.id}
          onClick={() => handleClick(`/knowledge/${k.categories?.[0] || "general"}/${k.id}`)}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          🧠 {k.title}
        </button>
      ))}
      {results.ingredients.map((i) => (
        <button
          key={i.id}
          onClick={() => handleClick(`/ingredients/${i.id}`)}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          🧪 {i.name}
        </button>
      ))}
      {results.products.map((p) => (
        <button
          key={p.id}
          onClick={() => handleClick(`/products/${p.id}`)}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          🧴 {p.name} ({p.brand})
        </button>
      ))}
    </div>
  );
}