"use client";
import { FaPlay } from "react-icons/fa6";
import Image from "next/image";

export default function Main() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="relative z-40">
        {/* Top Navbar */}
        <div
          className="h-125 bg-[#5980DB] relative z-20 "
          suppressHydrationWarning
        >
          <div className="relative flex justify-center h-full px-4 md:px-8 top-20">
            <div className="flex  flex-col lg:flex lg:flex-row items-center justify-center lg:justify-between w-full max-w-6xl gap-4 lg:gap-0">
              {/* Left side - Text content */}
              <div className="text-white max-w-md text-center lg:text-left  order-1 lg:order-1">
                <h1 className="text-5xl lg:text-7xl font-extrabold mb-4 lg:mb-6 leading-tight lg:leading-snug">
                  สวัสดีครับ,
                  <br />
                  น้องจุกจิก
                </h1>
                <p className="text-xl lg:text-2xl mb-6 lg:mb-10 opacity-90">
                  มาเล่นเกมกันเถอะ!
                </p>
                <button
                  onClick={scrollToNext}
                  className="bg-white text-black text-2xl lg:text-4xl px-12 lg:px-16 py-4 lg:py-6 rounded-full font-semibold 
                  shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center gap-4 hover:scale-105 
                  active:scale-95 mx-auto lg:mx-0 min-w-[250px] lg:min-w-[320px]"
                >
                  <span>เริ่มเลย</span>
                  <FaPlay className="text-black w-8 h-8 lg:w-10 lg:h-10" />
                </button>
              </div>

              {/* Right side - Bee character */}
              <div className="relative order-2 lg:order-2 z-30">
                <img
                  src="/assets/Bee_1.png"
                  alt="Bee Character"
                  className="drop-shadow-2xl w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SVG Decoration */}
        <div className="absolute w-full">
          {/* SVG Decoration */}
          <Image
            src="/header_wave.svg"
            alt="Navbar Decoration"
            width={2000}
            height={150}
            className="block w-full h-auto min-w-full object-cover z-10"
          />

          {/* Toy Car อยู่ด้านบน SVG */}
          <div className="absolute bottom-[-25px] left-10 z-20">
            <img
              src="/assets/Toy_Car.png"
              alt="Toy Car"
              className="object-contain w-[60px] sm:w-[80px] md:w-[250px]"
            />
          </div>
        </div>

      </div>
    </>
  );
}
