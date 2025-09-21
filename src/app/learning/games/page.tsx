"use client";
import React, { useState, useEffect } from "react";
import { BsFiletypeJpg, BsFiletypePng } from "react-icons/bs";

const Product: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [gameName, setGameName] = useState("");
  const [tensorflowLink, setTensorflowLink] = useState("");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<string[]>([]);
  const [questions, setQuestions] = useState([
    { id: 1, value: "" },
    { id: 2, value: "" },
    { id: 3, value: "" },
    { id: 4, value: "" },
    { id: 5, value: "" },
  ]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    imageFiles.forEach(file => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0
      };

      setUploadedImages(prev => [...prev, newFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedImages(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedImages(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'completed', progress: 100 }
              : f
          )
        );
      }, 2000);
    });
  };

  const removeFile = (id: number) => {
    setUploadedImages(prev => prev.filter(file => file.id !== id));
  };

  const handleTensorflowUpload = async () => {
    if (!tensorflowLink.trim()) {
      alert('กรุณาใส่ลิงค์ TensorFlow');
      return;
    }

    try {
      // จำลองการโหลดโมเดลและดึงคำถาม
      setIsModelLoaded(false);
      
      // Simulate loading
      setTimeout(() => {
        // จำลองคำถามที่ดึงมาจากโมเดล
        const mockQuestions = [
          "นี่คือสัตว์ชนิดใด?",
          "สีของวัตถุนี้คืออะไร?",
          "รูปร่างของวัตถุเป็นอย่างไร?",
          "วัตถุนี้ใช้ทำอะไร?",
          "วัตถุนี้มีขนาดเท่าไหร่?",
          "วัตถุนี้ทำจากวัสดุอะไร?",
          "วัตถุนี้อยู่ในหมวดหมู่ใด?",
          "จำนวนของวัตถุเท่าไหร่?"
        ];
        
        setAvailableQuestions(mockQuestions);
        setIsModelLoaded(true);
      }, 2000);
      
    } catch (error) {
      console.error('Error loading TensorFlow model:', error);
      alert('เกิดข้อผิดพลาดในการโหลดโมเดล');
    }
  };

  const handleQuestionChange = (id: number, value: string) => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, value } : q)
    );
  };

  const getImageIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return <BsFiletypeJpg className="w-6 h-6 md:w-8 md:h-8 text-[#373995]" />;
      case 'png':
        return <BsFiletypePng className="w-6 h-6 md:w-8 md:h-8 text-[#373995]" />;
      default:
        return <BsFiletypeJpg className="w-6 h-6 md:w-8 md:h-8 text-[#373995]" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#E8E8E8]">
      <div className="w-full max-w-5xl space-y-8 mt-20">

        {/* TensorFlow Model Link Upload Section - ด้านบนสุด */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-2 text-[#373995]">อัปโหลดลิงค์ TensorFlow</h2>
          <div className="w-full h-px bg-[#373995] mb-6"></div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="ใส่ลิงค์โมเดล TensorFlow ที่นี่..."
              value={tensorflowLink}
              onChange={(e) => setTensorflowLink(e.target.value)}
              className="flex-1 px-4 py-2 text-[#606060] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995] focus:border-transparent"
            />
            <button 
              onClick={handleTensorflowUpload}
              disabled={!tensorflowLink.trim()}
              suppressHydrationWarning
              className="px-6 py-2 bg-[#373995] text-white rounded-md hover:opacity-90 cursor-pointer transition-all whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {!isModelLoaded && tensorflowLink ? 'กำลังโหลด...' : 'อัปโหลดลิงค์'}
            </button>
          </div>
          
          {isModelLoaded && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-800 text-sm">โหลดโมเดล TensorFlow สำเร็จ! พบคำถาม {availableQuestions.length} ข้อ</span>
              </div>
            </div>
          )}
        </div>

        {/* Game Form Section - กลาง */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-2 text-[#373995]">สร้างเกม</h2>
          <div className="w-full h-px bg-[#373995] mb-6"></div>

          {/* ชื่อเกม */}
          <div className="mb-6">
            <label className="block text-black font-medium mb-2">ชื่อเกม</label>
            <input
              type="text"
              placeholder="กรุณาใส่ชื่อเกม"
              suppressHydrationWarning
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995] focus:border-transparent"
            />
          </div>

          {/* คำถาม 5 ข้อ - แสดงเฉพาะเมื่อโหลดโมเดลแล้ว */}
          {isModelLoaded && availableQuestions.length > 0 && (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#373995]">เลือกคำถาม 5 ข้อจากโมเดล</h3>
                <p className="text-sm text-gray-600">เลือกคำถามจากที่โมเดล TensorFlow วิเคราะห์ได้</p>
              </div>
              
              {questions.map((question, index) => (
                <div key={question.id} className="mb-6">
                  <label className="block text-black font-medium mb-2">
                    โจทย์ข้อที่ {index + 1}
                  </label>
                  <div className="relative">
                    <select
                      value={question.value}
                      onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">กรุณาเลือกคำถาม</option>
                      {availableQuestions.map((q, idx) => (
                        <option key={idx} value={q}>{q}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-[#373995]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* แสดงข้อความเมื่อยังไม่ได้โหลดโมเดล */}
          {!isModelLoaded && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p>กรุณาอัปโหลดลิงค์ TensorFlow ก่อนเพื่อโหลดคำถาม</p>
            </div>
          )}
        </div>

        {/* Image Upload Section - ด้านล่างสุด */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-2 text-[#373995]">อัปโหลดรูปภาพ</h2>
          <div className="w-full h-px bg-[#373995] mb-6"></div>
          
          {/* Drop Zone */}
          <div 
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-black mb-2">กรุณาเลือกรูปภาพที่ต้องการอัปโหลด</p>
                <p className="text-sm text-black opacity-70">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="px-4 py-2 bg-[#373995] text-white rounded-md hover:bg-[#373995] hover:opacity-90 cursor-pointer transition-all"
              >
                เลือกรูปภาพ
              </label>
            </div>
          </div>

          {/* Image List */}
          {uploadedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-[#373995]">
                รูปภาพที่อัปโหลด ({uploadedImages.length} ไฟล์)
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {uploadedImages.map((file, index) => (
                  <div key={`${file.id}-${index}`} className="border rounded-lg p-3 md:p-4 bg-gray-50 w-full">
                    <div className="flex items-start justify-between gap-2 md:gap-3">
                      <div className="flex items-start space-x-2 md:space-x-3 flex-1 min-w-0">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          {getImageIcon(file.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#373995] text-sm md:text-base leading-tight" 
                             title={file.name}>
                            <span className="block md:hidden">
                              {file.name.length > 20 ? `${file.name.substring(0, 17)}...` : file.name}
                            </span>
                            <span className="hidden md:block">
                              {file.name.length > 40 ? `${file.name.substring(0, 37)}...` : file.name}
                            </span>
                          </p>
                          <div className="text-xs md:text-sm text-[#373995] opacity-70 mt-1">
                            <div className="flex flex-wrap items-center gap-1 md:gap-2">
                              <span>{formatFileSize(file.size)}</span>
                              <span className="hidden md:inline">•</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                file.status === 'completed' ? 'bg-green-100 text-green-800' :
                                file.status === 'uploading' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {file.status === 'completed' ? 'อัปโหลดเสร็จแล้ว' : 
                                 file.status === 'uploading' ? 'กำลังอัปโหลด...' : 'เกิดข้อผิดพลาด'}
                              </span>
                              {file.status === 'completed' && (
                                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1 touch-manipulation"
                        title="ลบรูปภาพ"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2 mt-3">
                        <div 
                          className="bg-[#375EF9] h-1.5 md:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress || 0}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {uploadedImages.some(f => f.status === 'completed') && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-3">
              <button className="text-[#373995] hover:text-[#373995] hover:opacity-80 transition-colors text-left sm:text-center">
                ภาพรวมรูปภาพทั้งหมด
              </button>
              <button className="w-full sm:w-auto px-6 py-2 bg-[#373995] text-white rounded-md hover:bg-[#373995] hover:opacity-90 transition-all">
                สร้างเกม
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;





