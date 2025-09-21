import Image from "next/image";
import Main from "./components/Intro_mainpage";
import Content from "./components/Content_mainpage"

export default function Home() {
  return (
    <>
    
      <div className="relative z-10">
        <Main/>
      </div>


        <div className="relative ">
          <Content/>
        </div>
        
        
        
    </>
  );
}
