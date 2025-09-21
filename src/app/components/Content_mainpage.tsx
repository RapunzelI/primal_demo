"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";

export default function Main() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for cards
  const cardData = [
    {
      id: 1,
      image: "/test/learn_1.png",
      profileImage: "/profile/Teacher_1.png",
      name: "คุณครู A",
      description: "สื่อการสอนคณิตศาสตร์"
    },
    {
      id: 2,
      image: "/test/learn_2.png",
      profileImage: "/profile/Teacher_2.png",
      name: "คุณครู B",
      description: "สื่อการสอนภาษาไทย"
    },
    {
      id: 3,
      image: "/test/learn_3.png",
      profileImage: "/profile/Teacher_3.png",
      name: "คุณครู C",
      description: "สื่อการสอนวิทยาศาสตร์"
    },
    {
      id: 4,
      image: "/test/learn_4.png",
      profileImage: "/profile/Teacher_4.png",
      name: "คุณครู D",
      description: "สื่อการสอนสังคมศึกษา"
    },
    {
      id: 5,
      image: "/test/learn_5.png",
      profileImage: "/profile/Teacher_5.png",
      name: "คุณครู E",
      description: "สื่อการสอนภาษาอังกฤษ"
    },
    {
      id: 6,
      image: "/test/learn_6.png",
      profileImage: "/profile/Teacher_6.png",
      name: "คุณครู F",
      description: "สื่อการสอนศิลปะ"
    },
    {
      id: 7,
      image: "/test/learn_7.png",
      profileImage: "/profile/Teacher_7.png",
      name: "คุณครู G",
      description: "สื่อการสอนดนตรี"
    },
    {
      id: 8,
      image: "/test/learn_8.png",
      profileImage: "/profile/Teacher_8.png",
      name: "คุณครู H",
      description: "สื่อการสอนพลศึกษา"
    },
    {
      id: 9,
      image: "/test/learn_1.png",
      profileImage: "/profile/Teacher_1.png",
      name: "คุณครู I",
      description: "สื่อการสอนประวัติศาสตร์"
    },
    {
      id: 10,
      image: "/test/learn_2.png",
      profileImage: "/profile/Teacher_2.png",
      name: "คุณครู J",
      description: "สื่อการสอนภูมิศาสตร์"
    },
    {
      id: 11,
      image: "/test/learn_3.png",
      profileImage: "/profile/Teacher_3.png",
      name: "คุณครู K",
      description: "สื่อการสอนฟิสิกส์"
    },
    {
      id: 12,
      image: "/test/learn_4.png",
      profileImage: "/profile/Teacher_4.png",
      name: "คุณครู L",
      description: "สื่อการสอนเคมี"
    },
    {
      id: 13,
      image: "/test/learn_5.png",
      profileImage: "/profile/Teacher_5.png",
      name: "คุณครู M",
      description: "สื่อการสอนชีววิทยา"
    },
    {
      id: 14,
      image: "/test/learn_6.png",
      profileImage: "/profile/Teacher_6.png",
      name: "คุณครู N",
      description: "สื่อการสอนโลกศาสตร์"
    },
    {
      id: 15,
      image: "/test/learn_7.png",
      profileImage: "/profile/Teacher_7.png",
      name: "คุณครู O",
      description: "สื่อการสอนคอมพิวเตอร์"
    },
    {
      id: 16,
      image: "/test/learn_8.png",
      profileImage: "/profile/Teacher_8.png",
      name: "คุณครู P",
      description: "สื่อการสอนแนะแนว"
    }
  ];

  return (
    <div className="z-40 bg-[#E8E8E8] min-h-screen py-8 ">
      <div className="container mx-auto px-4 mt-60 md:mt-65 xl:mt-70">
        
        {/* Search Section */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md md:max-w-2xl xl:max-w-3xl">
            <input
              type="text"
              placeholder="ค้นหาข้อมูล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-[#373995] focus:outline-none focus:ring-2 focus:ring-[#373995] focus:border-[#373995] shadow-sm placeholder-[#606060] text-[#606060]"
              suppressHydrationWarning
            />
            <IoSearch 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#373995] text-xl cursor-pointer hover:text-[#2d2d7a] transition-colors"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 m-0 md:m-0 xl:m-16">
          {cardData.map((card) => (
            <motion.div
              key={card.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: card.id * 0.1 }}
            >
              {/* Main Card Image */}
              <div className="h-50 md:h-40 xl:h-44 overflow-hidden">
                <Image
                  src={card.image}
                  alt={`Card ${card.id}`}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Profile Section */}
              <div className="p-3 flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <Image
                    src={card.profileImage}
                    alt={`Profile ${card.id}`}
                    width={40}
                    height={40}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-gray-500 mb-1">{card.description}</p>
                  <h3 className="text-xs font-medium text-gray-800 truncate">
                    {card.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}