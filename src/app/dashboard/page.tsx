"use client";
import React, { useState } from 'react';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { IoIosArrowBack } from "react-icons/io";

const Dashboard = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // Mock data for main table
  const mainData = [
    { batch: 1, lesson: 1, name: 'มาวิน', lastname: 'สุขสันต์', type: 'อนุบาล 1', lessonName: 'บทเรียนที่ 1', totalTime: '4 นาที' },
    { batch: 1, lesson: 2, name: 'บิด', lastname: 'รุ่งเรือง', type: 'อนุบาล 1', lessonName: 'บทเรียนที่ 1', totalTime: '3 นาที' },
    { batch: 1, lesson: 3, name: 'นาตาลี', lastname: 'โรงนอน', type: 'อนุบาล 1', lessonName: 'บทเรียนที่ 1', totalTime: '5 นาที' },
    { batch: 2, lesson: 1, name: 'มาวิน', lastname: 'สุขสันต์', type: 'อนุบาล 1', lessonName: 'บทเรียนที่ 1', totalTime: '2 นาที' },
    { batch: 2, lesson: 2, name: 'บิด', lastname: 'รุ่งเรือง', type: 'อนุบาล 1', lessonName: 'บทเรียนที่ 1', totalTime: '5 นาที' },
    { batch: 2, lesson: 3, name: 'นาตาลี', lastname: 'โรงนอน', type: 'อนุบาล 1', lessonName: 'บทเรียนที่ 1', totalTime: '3 นาที' },
  ];

  // Mock data for detail view
  const detailData = [
    { batch: 'บทเรียนที่ 1', question: 1, topic: 'รูปทรงกลม', time: '30 วินาที', answer: '/api/placeholder/80/60' },
    { batch: 'บทเรียนที่ 1', question: 2, topic: 'รูปทรงกรวย', time: '45 วินาที', answer: '/api/placeholder/80/60' },
    { batch: 'บทเรียนที่ 1', question: 3, topic: 'รูปทรงกระบอก', time: '1 นาที', answer: '/api/placeholder/80/60' },
    { batch: 'บทเรียนที่ 1', question: 4, topic: 'รูปทรงพีระมิด', time: '25 วินาที', answer: '/api/placeholder/80/60' },
    { batch: 'บทเรียนที่ 1', question: 5, topic: 'รูปทรงลูกบาศก์', time: '50 วินาที', answer: '/api/placeholder/80/60' },
  ];

  const handleRowClick = (row) => {
    setSelectedBatch(row);
  };

  const handleBackClick = () => {
    setSelectedBatch(null);
  };

  if (selectedBatch) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 ">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg mt-25">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6 rounded-t-lg">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackClick}
                className="flex items-center text-[#373995] hover:text-[#5980DB] font-medium"
              >
                <IoIosArrowBack className="w-6 h-6 mr-2" />
              </button>
              <h1 className="text-2xl font-bold text-[#373995]">Dashboard</h1>
            </div>
          </div>

          {/* Detail Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-medium text-gray-600">บทเรียน</th>
                    <th className="text-left p-4 font-medium text-gray-600">ข้อที่</th>
                    <th className="text-left p-4 font-medium text-gray-600">โจทย์</th>
                    <th className="text-left p-4 font-medium text-gray-600">เวลาที่ใช้</th>
                    <th className="text-left p-4 font-medium text-gray-600">คำตอบ</th>
                  </tr>
                </thead>
                <tbody>
                  {detailData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">{item.batch}</td>
                      <td className="p-4">{item.question}</td>
                      <td className="p-4">{item.topic}</td>
                      <td className="p-4">{item.time}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-500">รูปภาพคำตอบ</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg mt-25">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-[#373995]">Dashboard</h1>
          
          {/* Filter dropdowns */}
          <div className="flex space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <label className="font-medium text-gray-700">บทเรียน</label>
              <select className="border border-gray-300 rounded px-3 py-1 bg-gray-50">
                <option>กำหนด</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="font-medium text-gray-700">ปีการศึกษา</label>
              <select className="border border-gray-300 rounded px-3 py-1 bg-gray-50">
                <option>กำหนด</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="font-medium text-gray-700">รอบที่</label>
              <select className="border border-gray-300 rounded px-3 py-1 bg-gray-50">
                <option>กำหนด</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-600">รอบที่</th>
                  <th className="text-left p-4 font-medium text-gray-600">เลขที่</th>
                  <th className="text-left p-4 font-medium text-gray-600">ชื่อ</th>
                  <th className="text-left p-4 font-medium text-gray-600">นามสกุล</th>
                  <th className="text-left p-4 font-medium text-gray-600">ชั้น</th>
                  <th className="text-left p-4 font-medium text-gray-600">บทเรียน</th>
                  <th className="text-left p-4 font-medium text-gray-600">เวลาที่ใช้</th>
                </tr>
              </thead>
              <tbody>
                {mainData.map((row, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(row)}
                  >
                    <td className="p-4">{row.batch}</td>
                    <td className="p-4">{row.lesson}</td>
                    <td className="p-4">{row.name}</td>
                    <td className="p-4">{row.lastname}</td>
                    <td className="p-4">{row.type}</td>
                    <td className="p-4">{row.lessonName}</td>
                    <td className="p-4">{row.totalTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;