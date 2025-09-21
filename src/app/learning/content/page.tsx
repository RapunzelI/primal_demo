"use client";
import React, { useState, useCallback } from "react";
import { BsFiletypeMp4 } from "react-icons/bs";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const Product: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const simulateUpload = (file: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          )
        );
        clearInterval(interval);
      } else {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, progress }
              : f
          )
        );
      }
    }, 200);
  };

  const handleFileSelect = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'video/mp4' || file.name.endsWith('.mp4')) {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'uploading'
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        simulateUpload(newFile);
      }
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#E8E8E8]">
      
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 md:p-8 mt-8 md:mt-10">
        <h2 className="text-xl font-semibold mb-2 text-[#373995]">อัปโหลดไฟล์</h2>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-black mb-2">กรุณาเลือกไฟล์วิดีโอที่ต้องการอัปโหลด</p>
              <p className="text-sm text-black opacity-70">รองรับเฉพาะไฟล์ MP4, ขนาดไม่เกิน 50MB</p>
            </div>
            <input
              type="file"
              accept=".mp4,video/mp4"
              onChange={handleFileInputChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="px-4 py-2 bg-[#373995] text-white rounded-md hover:bg-[#373995] hover:opacity-90 cursor-pointer transition-all"
            >
              เลือกไฟล์
            </label>
          </div>
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-[#373995]">
              ไฟล์ที่อัปโหลด ({uploadedFiles.length} ไฟล์)
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div key={`${file.id}-${index}`} className="border rounded-lg p-3 md:p-4 bg-gray-50 w-full">
                  <div className="flex items-start justify-between gap-2 md:gap-3">
                    <div className="flex items-start space-x-2 md:space-x-3 flex-1 min-w-0">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BsFiletypeMp4 className="w-6 h-6 md:w-8 md:h-8 text-[#373995]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#373995] text-sm md:text-base leading-tight" 
                           title={file.name}>
                          {/* ย่อชื่อไฟล์สำหรับ mobile */}
                          <span className="block md:hidden">
                            {file.name.length > 20 ? `${file.name.substring(0, 17)}...` : file.name}
                          </span>
                          {/* ชื่อไฟล์เต็มสำหรับ desktop */}
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
                      title="ลบไฟล์"
                    >
                      {file.status === 'completed' ? (
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
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

        {/* Upload Button */}
        {uploadedFiles.some(f => f.status === 'completed') && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-3">
            <button className="text-[#373995] hover:text-[#373995] hover:opacity-80 transition-colors text-left sm:text-center">
              ภาพรวมไฟล์โดยงามวิหาร
            </button>
            <button className="w-full sm:w-auto px-6 py-2 bg-[#373995] text-white rounded-md hover:bg-[#373995] hover:opacity-90 transition-all">
              อัปโหลด
            </button>
          </div>
        )}

        {/* Link Upload Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-2 text-[#373995]">อัปโหลดจากลิ้งค์</h3>
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <input
              type="url"
              placeholder="ใส่ลิ้งค์วิดีโอ MP4 ที่นี่..."
              className="flex-1 px-4 py-2 text-[#606060] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995] focus:border-transparent"
            />
            <button className="px-6 py-2 bg-[#373995] text-white rounded-md hover:bg-[#373995] hover:opacity-90 cursor-pointer transition-all whitespace-nowrap">
              อัปโหลดจากลิ้งค์
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Product;





