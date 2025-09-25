import Image from "next/image";
import Main from "./components/Intro_mainpage";
import Content from "./components/Content_mainpage"
import LogoutButton from "./components/LogoutButton"
import Link from "next/link";

export default function Home() {
  return (
    <>
    <div className="main">
      <div className="relative z-10">
        <Main/>
      </div>

      
          {/* CTA บนหน้าแรก */}
          <div className="mt-6 flex gap-3">
            <Link
              href="/signin"
              className="rounded-full bg-[#373995] text-white px-5 py-2 font-semibold hover:brightness-110 transition"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white text-[#373995] border border-[#373995] px-5 py-2 font-semibold hover:bg-[#f5f6ff] transition"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>


      
  
      <div className="Content">
        <div className="relative z-0">
          <Content/>
        </div>
        </div>
        
    </>
  );
}
