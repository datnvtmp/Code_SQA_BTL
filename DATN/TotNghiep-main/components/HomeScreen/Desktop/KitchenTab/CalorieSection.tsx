'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Food {
  id: string | number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
  serving_size: string;
  image_url: string;
}

const CalorieSection: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const API_BASE = process.env.NEXT_PUBLIC_API_DATA;

  const { data: foods = [], isLoading } = useQuery<Food[]>({
    queryKey: ['foods'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/calories`);
      const json = await res.json();
      return json.success ? json.data : [];
    }
  });

  // Lấy danh sách category duy nhất
  const categories = useMemo(() => Array.from(new Set(foods.map(f => f.category))), [foods]);

  // Khi chưa có activeCategory, mặc định lấy category đầu tiên
  const currentCategory = activeCategory || (categories.length > 0 ? categories[0] : '');

  // Lọc món theo category
  const filteredFoods = useMemo(
    () => foods.filter(f => f.category === currentCategory),
    [foods, currentCategory]
  );

  // Chart data
  const chartData = selectedFood
    ? {
        labels: ['Calories (kcal)', 'Protein (g)', 'Fat (g)', 'Carb (g)'],
        datasets: [
          {
            label: selectedFood.name,
            data: [
              selectedFood.calories,
              selectedFood.protein,
              selectedFood.fat,
              selectedFood.carb
            ],
            backgroundColor: ['#22c55e', '#3b82f6', '#facc15', '#ec4899']
          }
        ]
      }
    : null;

  return (
    <section className="py-16 px-4 sm:px-16 bg-gradient-to-r from-green-50 via-yellow-50 to-pink-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-md">
          Bạn có biết dinh dưỡng của các món ăn phổ biến đang ăn không?
        </h2>
        <p className="text-gray-700 text-lg md:text-xl">
          Chọn món ăn theo nhóm và xem ngay biểu đồ lượng calo cùng các chất dinh dưỡng.
        </p>

        {isLoading && (
          <p className="text-gray-500 mt-4 animate-pulse">Đang tải danh sách món ăn...</p>
        )}

        {!isLoading && categories.length > 0 && (
          <>
            {/* Tabs category */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full font-semibold transition shadow-md ${
                    currentCategory === cat
                      ? 'bg-gradient-to-r from-green-400 via-green-300 to-green-500 text-white scale-105 shadow-xl'
                      : 'bg-gray-200 text-gray-800 hover:bg-green-400 hover:text-white hover:scale-105'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dropdown chọn món theo category */}
            <div className="flex justify-center mt-6">
              <select
                className="border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 transition w-64"
                onChange={(e) => {
                  const food = filteredFoods.find(f => String(f.id) === e.target.value) || null;
                  setSelectedFood(food);
                }}
                value={selectedFood ? String(selectedFood.id) : ''}
              >
                <option value="">-- Chọn món ăn --</option>
                {filteredFoods.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card + Chart */}
            {selectedFood && (
              <div className="mt-8 flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full md:w-96 flex flex-col items-center gap-4 hover:scale-105 transition-transform">
                  {selectedFood.image_url && (
                    <img
                      src={selectedFood.image_url}
                      alt={selectedFood.name}
                      className="w-48 h-48 object-cover rounded-xl shadow-md"
                    />
                  )}
                  <h3 className="text-2xl font-bold text-gray-900">{selectedFood.name}</h3>
                  <p className="text-gray-600">Khẩu phần: {selectedFood.serving_size}</p>
                  <div className="grid grid-cols-2 gap-4 mt-2 w-full">
                    <div className="bg-green-100 text-green-800 font-semibold px-3 py-2 rounded-lg text-center">
                      🔥 {selectedFood.calories} kcal
                    </div>
                    <div className="bg-blue-100 text-blue-800 font-semibold px-3 py-2 rounded-lg text-center">
                      🥩 {selectedFood.protein} g
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 font-semibold px-3 py-2 rounded-lg text-center">
                      🥑 {selectedFood.fat} g
                    </div>
                    <div className="bg-pink-100 text-pink-800 font-semibold px-3 py-2 rounded-lg text-center">
                      🍚 {selectedFood.carb} g
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full md:w-96 hover:scale-105 transition-transform">
                  {chartData && <Bar data={chartData} />}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CalorieSection;
