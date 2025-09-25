"use client";
import React, { useState, useCallback } from "react";
import { BsFileEarmarkExcel } from "react-icons/bs";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import * as XLSX from 'xlsx';

interface Student {
  id: number;
  prefix: string;
  firstName: string;
  lastName: string;
  gradeYear: string;
  avatar?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'completed';
}

const StudentManagement: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    prefix: "",
    firstName: "",
    lastName: "",
    gradeYear: "",
    avatar: ""
  });

  const prefixOptions = [
    "เด็กชาย",
    "เด็กหญิง"
  ];

  const gradeYearOptions = [
    "อนุบาล 1",
    "อนุบาล 2", 
    "อนุบาล 3"
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const generateAvatar = (firstName: string, lastName: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    const initial = firstName.charAt(0) + lastName.charAt(0);
    const colorIndex = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;
    return {
      initials: initial.toUpperCase(),
      color: colors[colorIndex]
    };
  };

  const processExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const studentsData = jsonData.map((row: any, index) => ({
          id: index + 1,
          prefix: row['คำนำหน้า'] || row['prefix'] || '',
          firstName: row['ชื่อ'] || row['firstName'] || '',
          lastName: row['นามสกุล'] || row['lastName'] || '',
          gradeYear: row['ชั้นปี'] || row['gradeYear'] || '',
          avatar: row['รูปภาพ'] || row['avatar'] || row['รูป'] || ''
        }));
        
        setStudents(studentsData);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel' || 
          file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls')) {
        
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          status: 'completed'
        };
        
        setUploadedFiles([newFile]);
        processExcelFile(file);
      } else {
        alert('กรุณาเลือกไฟล์ Excel (.xlsx หรือ .xls) เท่านั้น');
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

  const filteredStudents = students.filter(student =>
    student.prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.gradeYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.lastName) {
      const student: Student = {
        id: students.length + 1,
        ...newStudent
      };
      setStudents([...students, student]);
      setNewStudent({ prefix: "", firstName: "", lastName: "", gradeYear: "", avatar: "" });
      setIsAddingStudent(false);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({
      prefix: student.prefix,
      firstName: student.firstName,
      lastName: student.lastName,
      gradeYear: student.gradeYear,
      avatar: student.avatar || ""
    });
  };

  const handleUpdateStudent = () => {
    if (editingStudent && newStudent.firstName && newStudent.lastName) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...newStudent }
          : s
      ));
      setEditingStudent(null);
      setNewStudent({ prefix: "", firstName: "", lastName: "", gradeYear: "", avatar: "" });
    }
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm('คุณต้องการลบข้อมูลนักเรียนคนนี้หรือไม่?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const convertGoogleDriveUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const match = url.match(/[-\w]{25,}/);
      if (match) {
        const fileId = match[0];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
      }
    }
    return url;
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(convertGoogleDriveUrl(imageUrl));
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#E8E8E8]">
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage} 
              alt="รูปภาพขนาดใหญ่"
              className="max-w-full max-h-screen object-contain rounded-lg"
              onClick={closeImageModal}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 md:p-8 mb-4 mt-20">
        <h1 className="text-2xl font-semibold text-[#373995] mb-2">ระบบจัดการนักเรียน</h1>
        <p className="text-gray-600">Student Management System</p>
      </div>

      {/* Upload Section */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 md:p-8 mb-4">
        <h2 className="text-xl font-semibold mb-2 text-[#373995]">เพิ่มข้อมูลนักเรียน</h2>
        <div className="w-full h-px bg-[#373995] mb-6"></div>
        
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
              <BsFileEarmarkExcel className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-black mb-2">กรุณาเลือกไฟล์ Excel ที่ต้องการอัปโหลด</p>
              <p className="text-sm text-black opacity-70">รองรับไฟล์ .xlsx และ .xls เท่านั้น</p>
              <p className="text-xs text-gray-500 mt-2">
                คอลัมน์ที่ต้องมี: คำนำหน้า, ชื่อ, นามสกุล, ชั้นปี (อนุบาล 1, อนุบาล 2, อนุบาล 3, ป.1-ป.6, ม.1-ม.6), รูปภาพ (ไม่บังคับ)
              </p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
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
      </div>

      {/* Student Data Table */}
      {students.length > 0 && (
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold text-[#373995]">
              รายชื่อนักเรียน ({filteredStudents.length} คน)
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหานักเรียน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995] focus:border-transparent w-full sm:w-64"
                />
              </div>
              <button
                onClick={() => setIsAddingStudent(true)}
                className="px-4 py-2 bg-[#373995] text-white rounded-md hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                เพิ่ม
              </button>
            </div>
          </div>

          {/* Add/Edit Student Form */}
          {(isAddingStudent || editingStudent) && (
            <div className="mb-6 p-4 border-2 border-dashed border-[#373995] rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-3 text-[#373995]">
                {editingStudent ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">คำนำหน้า *</label>
                  <select
                    value={newStudent.prefix}
                    onChange={(e) => setNewStudent({...newStudent, prefix: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995]"
                  >
                    <option value="">เลือกคำนำหน้า</option>
                    {prefixOptions.map(prefix => (
                      <option key={prefix} value={prefix}>{prefix}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
                  <input
                    type="text"
                    placeholder="กรอกชื่อ"
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล *</label>
                  <input
                    type="text"
                    placeholder="กรอกนามสกุล"
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชั้นปี *</label>
                  <select
                    value={newStudent.gradeYear}
                    onChange={(e) => setNewStudent({...newStudent, gradeYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995]"
                  >
                    <option value="">เลือกชั้นปี</option>
                    {gradeYearOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ (ไม่บังคับ)</label>
                  <input
                    type="text"
                    placeholder="กรอก URL รูปภาพหรือลิงก์ Google Drive"
                    value={newStudent.avatar}
                    onChange={(e) => setNewStudent({...newStudent, avatar: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#373995]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                  className="px-4 py-2 bg-[#373995] text-white rounded-md hover:opacity-90 transition-all"
                >
                  {editingStudent ? 'อัปเดต' : 'เพิ่ม'}
                </button>
                <button
                  onClick={() => {
                    setIsAddingStudent(false);
                    setEditingStudent(null);
                    setNewStudent({ prefix: "", firstName: "", lastName: "", gradeYear: "", avatar: "" });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ลำดับ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">คำนำหน้า</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ชื่อ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">นามสกุล</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ชั้นปี</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">รูปภาพ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => {
                  const avatar = generateAvatar(student.firstName, student.lastName);
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">{student.prefix}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#373995]">
                        {student.firstName}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[#373995]">
                        {student.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm">{student.gradeYear}</td>
                      <td className="px-4 py-3">
                        {student.avatar ? (
                          <img 
                            src={convertGoogleDriveUrl(student.avatar)} 
                            alt={`${student.prefix}${student.firstName} ${student.lastName}`}
                            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleImageClick(student.avatar!)}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ 
                            backgroundColor: avatar.color,
                            display: student.avatar ? 'none' : 'flex'
                          }}
                          onClick={() => student.avatar && handleImageClick(student.avatar)}
                        >
                          {avatar.initials}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="แก้ไข"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              ไม่พบข้อมูลที่ค้นหา "{searchTerm}"
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
            <button 
              onClick={() => {
                setStudents([]);
                setUploadedFiles([]);
              }}
              className="text-[#373995] hover:opacity-80 transition-colors"
            >
              ล้างข้อมูลและอัปโหลดไฟล์ใหม่
            </button>
            <button className="w-full sm:w-auto px-6 py-2 bg-[#373995] text-white rounded-md hover:opacity-90 transition-all">
              ดึงข้อมูลการลงทะเบียน
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
