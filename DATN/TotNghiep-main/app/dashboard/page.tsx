"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Header from "@components/Common/Header";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

interface StatusCount { status: string; count: number; }
interface DifficultyCount { difficulty: string; count: number; }
interface ScopeCount { scope: string; count: number; }
interface StatisticsData {
  totalRecipes: number;
  totalViews: number;
  totalLikes: number;
  byStatus: StatusCount[];
  byDifficulty: DifficultyCount[];
  byScope: ScopeCount[];
}
interface DailyViewSummary { date: string; totalView: number; details: { count: number; date: string; recipeId: number }[]; }

interface Recipe {
  id: number;
  title: string;
}

const fetchStatistics = async (): Promise<StatisticsData> => {
  const token = useAuthStore.getState().token;
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/statistics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

const fetchDailyViews = async (): Promise<DailyViewSummary[]> => {
  const token = useAuthStore.getState().token;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/statistics/recipes/views?days=7`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

const fetchMyRecipes = async (): Promise<Recipe[]> => {
  const token = useAuthStore.getState().token;
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.content;
};

export default function Dashboard() {
  const router = useRouter();

  const { data: stats, isLoading: statsLoading } = useQuery<StatisticsData, Error>({
    queryKey: ["statistics"],
    queryFn: fetchStatistics,
  });

  const { data: dailyViews, isLoading: dailyLoading } = useQuery<DailyViewSummary[], Error>({
    queryKey: ["dailyViews"],
    queryFn: fetchDailyViews,
  });

  const { data: recipes, isLoading: recipesLoading } = useQuery<Recipe[], Error>({
    queryKey: ["myRecipes"],
    queryFn: fetchMyRecipes,
  });

  if (statsLoading || dailyLoading || recipesLoading) {
    return <p className="p-6 text-center text-lg font-semibold">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <div className="pt-24 px-6 pb-12 space-y-10">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-6 drop-shadow-md">
          Dashboard Thống Kê Công Thức
        </h1>

        {/* Tổng quan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <span className="text-sm opacity-80">Tổng công thức</span>
            <span className="text-3xl font-bold">{stats?.totalRecipes}</span>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <span className="text-sm opacity-80">Tổng lượt xem</span>
            <span className="text-3xl font-bold">{stats?.totalViews}</span>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <span className="text-sm opacity-80">Tổng lượt thích</span>
            <span className="text-3xl font-bold">{stats?.totalLikes}</span>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="font-bold mb-2 text-purple-600">Công thức theo trạng thái</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.byStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="font-bold mb-2 text-green-600">Công thức theo độ khó</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.byDifficulty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="difficulty" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="font-bold mb-2 text-yellow-600">Công thức theo phạm vi</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.byScope}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scope" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="font-bold mb-2 text-red-500">Lượt xem 7 ngày gần nhất</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="totalView" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Danh sách công thức */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-bold mb-4 text-lg text-purple-700">Công thức của bạn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recipes?.map((r) => (
              <div
                key={r.id}
                className="bg-purple-50 p-4 rounded-lg flex justify-between items-center shadow hover:shadow-lg transition-shadow"
              >
                <span className="font-medium">{r.title}</span>
                <button
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  onClick={() => router.push(`/dashboard/recipe/${r.id}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
