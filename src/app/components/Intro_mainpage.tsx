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
          className="h-170 md:h-140 xl:h-130 bg-[#5980DB] relative z-20"
          suppressHydrationWarning
        >
          <div className="relative flex justify-center h-full px-4 md:px-8 top-20">
            {/* Toy Car for Mobile - positioned at the top */}
            <div className="absolute top-[-60px] left-4 z-30 md:hidden">
              <img
                src="/assets/Toy_Car.png"
                alt="Toy Car"
                className="object-contain w-[130px]"
              />
            </div>

            <div className="flex flex-col md:flex md:flex-row items-center justify-center md:justify-between w-full max-w-6xl gap-8 md:gap-12 lg:gap-8">
              {/* Left side - Text content */}
              <div className="text-white max-w-md text-center md:text-left order-1 md:order-1 mb-8 md:mb-0 md:transform md:translate-x-40 
              xl:transform xl:translate-x-40 md:-translate-y-16 xl:-translate-y-12 mb-10 mt-40 md:mt-0">
                <h1 className="text-5xl md:text-7xl lg:text-6xl font-extrabold mb-4 lg:mb-6 leading-tight lg:leading-snug">
                  สวัสดีครับ
                  <br />
                  น้องๆทุกคน
                </h1>
                <p className="text-xl lg:text-2xl mb-6 lg:mb-10 opacity-90">
                  มาเริ่มเรียนกันเลย!!!
                </p>
                <button
                  onClick={scrollToNext}
                  suppressHydrationWarning
                  className="bg-white text-black text-2xl lg:text-4xl px-12 lg:px-16 py-4 lg:py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center gap-4 hover:scale-105 active:scale-95 mx-auto md:mx-0 min-w-[250px] lg:min-w-[320px]"
                >
                  <span>เริ่มเลย</span>
                  <FaPlay className="text-black w-8 h-8 lg:w-10 lg:h-10" />
                </button>
              </div>

              {/* Right side - Bee character */}
              <div className="relative order-2 md:order-2 z-30 md:mr-20 xl:mr-0">
                {/* Cloud image positioned above the bee */}
                <img
                  src="/assets/Cloud.png"
                  alt="Cloud"
                  className="absolute -top-12 -right-8 md:-top-2 md:-right-25 xl:top-10 xl:-right-35 w-[120px] h-[70px] md:w-[180px] md:h-[120px] xl:w-[200px] xl:h-[140px] object-contain z-40"
                />
                <img
                  src="/assets/Bee_1.png"
                  alt="Bee Character"
                  className="drop-shadow-2xl w-[350px] h-[350px] md:w-[550px] md:h-[550px] xl:w-[600px] xl:h-[600px] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SVG Decoration */}
        <div className="absolute w-full left-0 right-0">
          <Image
            src="/header_wave.svg"
            alt="Navbar Decoration"
            width={2000}
            height={150}
            className="w-full h-auto object-cover z-10"
            style={{ minWidth: "100vw", transform: "scaleX(1.2)" }}
          />
          {/* Toy Car for Desktop/Tablet - positioned on SVG */}
          <div className="absolute bottom-[-25px] ml-5 md:ml-15 xl:ml-10 z-20 hidden md:block">
            <img
              src="/assets/Toy_Car.png"
              alt="Toy Car"
              className="object-contain w-[200px] md:w-[250px] xl:w-[300px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}