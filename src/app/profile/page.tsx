"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { PiVideoFill } from "react-icons/pi";
import { PiGameControllerFill } from "react-icons/pi";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState("กิจกรรม");

  // Sample data for lessons
  const lessonData = [
    { id: 1, title: "Math Lesson", icon: <PiVideoFill className="text-gray-600 text-xl" />, bgColor: "bg-blue-400" },
    { id: 2, title: "Science Lesson", icon: <PiVideoFill className="text-gray-600 text-xl" />, bgColor: "bg-indigo-400" },
    { id: 3, title: "History Lesson", icon: <PiVideoFill className="text-gray-600 text-xl" />, bgColor: "bg-pink-400" },
    { id: 4, title: "Language Lesson", icon: <PiVideoFill className="text-gray-600 text-xl" />, bgColor: "bg-teal-400" },
    { id: 5, title: "Math Lesson", icon: <PiVideoFill className="text-gray-600 text-xl" />, bgColor: "bg-blue-400" },
    { id: 6, title: "Science Lesson", icon: <PiVideoFill className="text-gray-600 text-xl" />, bgColor: "bg-indigo-400" },
    { id: 7, title: "History Lesson", icon: <PiVideoFill className="text-gray-600 text-xl" />, bgColor: "bg-pink-400" },
    { id: 8, title: "Language Lesson", icon: <PiVideoFill className="text-gray-600 text-xl" />, bgColor: "bg-teal-400" },
  ];

  // Sample data for games
  const gameData = [
    { id: 5, title: "Puzzle Game", icon: <PiGameControllerFill className="text-gray-600 text-xl" />, bgColor: "bg-orange-400" },
    { id: 6, title: "Memory Game", icon: <PiGameControllerFill className="text-gray-600 text-xl" />, bgColor: "bg-cyan-400" },
    { id: 7, title: "Quiz Game", icon: <PiGameControllerFill className="text-gray-600 text-xl" />, bgColor: "bg-lime-400" },
    { id: 8, title: "Word Game", icon: <PiGameControllerFill className="text-gray-600 text-xl" />, bgColor: "bg-rose-400" },
    { id: 9, title: "Quiz Game", icon: <PiGameControllerFill className="text-gray-600 text-xl" />, bgColor: "bg-lime-400" },
    { id: 10, title: "Word Game", icon: <PiGameControllerFill className="text-gray-600 text-xl" />, bgColor: "bg-rose-400" },
  ];

  // Activity data is now a combination of lessons and games
  const activityData = [...lessonData, ...gameData];

  const getCurrentData = () => {
    switch (activeTab) {
      case "กิจกรรม":
        return activityData; // Returns combined lessons and games
      case "บทเรียน":
        return lessonData;
      case "เกม":
        return gameData;
      default:
        return activityData;
    }
  };

  // Scrollable Cards Component
  const ScrollableCards = ({ data, title, icon }: { data: any[], title: string, icon: React.ReactNode }) => {
    const scrollContainer = (direction: 'left' | 'right', containerId: string) => {
      const container = document.getElementById(containerId);
      if (container) {
        const scrollAmount = 280; // Width of one card + gap
        const currentScroll = container.scrollLeft;
        const targetScroll = direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount;
        
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    };

    const containerId = title === 'บทเรียน' ? 'lessons-container' : 'games-container';

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          {data.length > 4 && (
            <div className="flex gap-2">
              <button
                onClick={() => scrollContainer('left', containerId)}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => scrollContainer('right', containerId)}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
        <div 
          id={containerId}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            #${containerId}::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {data.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-64"
            >
              <div className={`${card.bgColor} h-32 relative flex items-center justify-center`}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{card.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top Section with Profile */}
      <div className="relative z-40">
        <div className="h-96 md:h-100 xl:h-80 bg-[#5980DB]  relative z-20">
          <div className="container mx-auto px-4 relative  flex justify-start h-full pt-12">
            
            {/* Profile section - positioned with image and text side by side */}
            <div className="text-white text-left mb-8 md:mb-0 ml-0 md:ml-32 xl:ml-48 mt-22">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 md:w-50 md:h-50 rounded-full bg-orange-400 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {/* Profile image placeholder */}
                  <Image
                    src="/profile/Teacher_1.png"
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    คุณครู สมคิด สำคัญทอง
                  </h2>
                  <p className="text-lg md:text-xl opacity-90 mb-1">
                    ผู้พัฒนา ธีมจากฝั่งฯ
                  </p>
                  <p className="text-base md:text-lg opacity-80">
                    งาน 3 ชิ้นงาน
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Wave Decoration - flipped */}
        <div className="absolute w-full left-0 right-0">
          <Image
            src="/header_wave.svg"
            alt="Wave Decoration"
            width={2000}
            height={150}
            className="w-full h-auto object-cover z-10"
            style={{ minWidth: "100vw", transform: "scaleX(-1.2)" }}
          />
          
          {/* Decorative shapes - positioned near wave */}
          <div className="absolute top-4 right-4 md:-top-20 md:right-8 z-30">
            <Image
              src="/shapes.png"
              alt="Decorative Shapes"
              width={120}
              height={120}
              className="w-[80px] h-[80px] md:w-[300px] md:h-[300px] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-[#E8E8E8] min-h-screen py-8 relative z-30 ">
        <div className="container mx-auto px-4 pt-16">
          
          {/* Navigation Tabs - aligned with profile */}
          <div className="flex justify-start mb-8 mt-10">
            <div className="flex gap-4 ml-0 md:ml-32 xl:ml-48">
              <button 
                onClick={() => setActiveTab("กิจกรรม")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors bg-white shadow-md ${
                  activeTab === "กิจกรรม" 
                    ? "border-2 border-green-500 text-green-600" 
                    : "border-2 border-transparent text-gray-600 hover:border-gray-300"
                }`}
              >
                <FaStar className={activeTab === "กิจกรรม" ? "text-yellow-300" : "text-gray-600"} />
                กิจกรรม
              </button>
              <button 
                onClick={() => setActiveTab("บทเรียน")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors bg-white shadow-md ${
                  activeTab === "บทเรียน" 
                    ? "border-2 border-green-500 text-green-600" 
                    : "border-2 border-transparent text-gray-600 hover:border-gray-300"
                }`}
              >
                <PiVideoFill />
                บทเรียน
              </button>
              <button 
                onClick={() => setActiveTab("เกม")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors bg-white shadow-md ${
                  activeTab === "เกม" 
                    ? "border-2 border-green-500 text-green-600" 
                    : "border-2 border-transparent text-gray-600 hover:border-gray-300"
                }`}
              >
                <PiGameControllerFill />
                เกม
              </button>
            </div>
          </div>

          {/* Content Display */}
          {activeTab === "กิจกรรม" ? (
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Lessons Section with Scrollable Cards */}
              <ScrollableCards 
                data={lessonData} 
                title="บทเรียน" 
                icon={<PiVideoFill className="text-gray-600 text-2xl" />}
              />

              {/* Games Section with Scrollable Cards */}
              <ScrollableCards 
                data={gameData} 
                title="เกม" 
                icon={<PiGameControllerFill className="text-gray-600 text-2xl" />}
              />
            </div>
          ) : (
            /* Single category grid for บทเรียน or เกม tabs */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {getCurrentData().map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`${card.bgColor} h-32 relative flex items-center justify-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{card.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;