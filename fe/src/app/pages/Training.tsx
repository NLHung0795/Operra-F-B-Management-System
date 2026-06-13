import React from 'react';
import { 
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  Star,
  Trophy,
  Users
} from 'lucide-react';

const COURSES = [
  { 
    id: 1, 
    title: 'Kỹ năng Up-sell & Cross-sell cơ bản', 
    category: 'Nghiệp vụ Phục vụ', 
    duration: '2 giờ', 
    enrolled: 45, 
    completed: 32, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwd2FpdGVyfGVufDF8fHx8MTc3NTQ2NTI1M3ww&ixlib=rb-4.1.0&q=80&w=400',
    status: 'active'
  },
  { 
    id: 2, 
    title: 'An toàn Vệ sinh Thực phẩm 2026', 
    category: 'Quy định bắt buộc', 
    duration: '4 giờ', 
    enrolled: 120, 
    completed: 110, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcndvcmtlcnN8ZW58MXx8fHwxNzc1NDY1MzIyfDA&ixlib=rb-4.1.0&q=80&w=400',
    status: 'active'
  },
  { 
    id: 3, 
    title: 'Pha chế Cocktail Cổ điển', 
    category: 'Nghiệp vụ Pha chế', 
    duration: '6 giờ', 
    enrolled: 15, 
    completed: 8, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJ0ZW5kZXJ8ZW58MXx8fHwxNzc1NDY1Mzc0fDA&ixlib=rb-4.1.0&q=80&w=400',
    status: 'draft'
  }
];

export function Training() {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const courseList = useMock ? COURSES : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đào tạo Nội bộ</h1>
          <p className="text-gray-500 text-sm">Quản lý khóa học, bài kiểm tra và cấp chứng chỉ nhân sự F&B</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200">
            <BookOpen className="w-4 h-4" />
            Tạo khóa học mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng khóa học</p>
              <h4 className="text-2xl font-bold text-gray-900">{useMock ? '12' : '0'}</h4>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Đang học</p>
              <h4 className="text-2xl font-bold text-gray-900">{useMock ? '156' : '0'}</h4>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tỷ lệ hoàn thành</p>
              <h4 className="text-2xl font-bold text-gray-900">{useMock ? '82%' : '0%'}</h4>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Chứng chỉ đã cấp</p>
              <h4 className="text-2xl font-bold text-gray-900">{useMock ? '342' : '0'}</h4>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Danh sách Khóa học</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseList.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-100 text-center text-sm text-gray-500">
            Chưa có khóa học nào (Vui lòng bật Mock Data)
          </div>
        ) : (
          courseList.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all cursor-pointer">
              <div className="relative h-48">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full ${
                  course.status === 'active' ? 'bg-emerald-5050 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {course.status === 'active' ? 'Đang mở' : 'Bản nháp'}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-medium border border-white/30">
                    {course.category}
                  </span>
                  <h4 className="text-lg font-bold mt-2 leading-tight">{course.title}</h4>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    {course.rating}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-500">Tiến độ khóa học</span>
                    <span className="text-[#007AFF]">{course.completed}/{course.enrolled} Đạt</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-[#007AFF] h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${(course.completed / course.enrolled) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#007AFF] transition-colors">
                    <PlayCircle className="w-4 h-4" />
                    Xem nội dung
                  </button>
                  <button className="text-sm font-bold text-[#007AFF] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    Báo cáo
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
