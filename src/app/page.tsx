import Image from "next/image";
import Main from "./components/Intro_mainpage";
import Content from "./components/Content_mainpage"
import Link from "next/link";

export default function Home() {
  return (
    <>
    <div className="main">
      <div className="relative z-10">
        <Main/>
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
