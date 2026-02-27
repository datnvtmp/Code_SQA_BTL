"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Header from "@components/Common/Header";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

interface RecipeStats {
    totalViews: number;
    totalLikes: number;
    status: string;
    title: string;
}

interface DailyView {
    count: number;
    date: string;
    recipeId: number;
}

interface DailyLike {
    count: number;
    date: string;
    recipeId: number;
}

const fetchRecipeStats = async (recipeId: string): Promise<RecipeStats> => {
    const token = useAuthStore.getState().token;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/my`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const recipe = res.data.data.content.find((r: any) => r.id === Number(recipeId));
    if (!recipe) throw new Error("Công thức không tồn tại");
    return {
        totalViews: recipe.views,
        totalLikes: recipe.likeCount,
        status: recipe.status,
        title: recipe.title,
    };
};

const fetchDailyViews = async (recipeId: string): Promise<DailyView[]> => {
    const token = useAuthStore.getState().token;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/statistics/${recipeId}/views`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.dailyStats as DailyView[];
};

const fetchDailyLike = async (recipeId: string): Promise<DailyView[]> => {
    const token = useAuthStore.getState().token;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/statistics/${recipeId}/likes`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.dailyStats as DailyLike[];
};

export default function RecipeDetailPage() {
    const router = useRouter();
    const params = useParams();
    const recipeId = params?.id as string;

    const { data: stats, isLoading: statsLoading } = useQuery<RecipeStats, Error>({
        queryKey: ["recipeStats", recipeId],
        queryFn: () => fetchRecipeStats(recipeId),
    });

    const { data: dailyViews, isLoading: viewsLoading } = useQuery<DailyView[], Error>({
        queryKey: ["recipeDailyViews", recipeId],
        queryFn: () => fetchDailyViews(recipeId),
    });

    const { data: dailyLikes, isLoading: likesLoading } = useQuery<DailyView[], Error>({
        queryKey: ["recipeDailyLikes", recipeId],
        queryFn: () => fetchDailyLike(recipeId),
    });

    if (statsLoading || viewsLoading) {
        return <p className="p-6 text-center text-lg font-semibold">Đang tải dữ liệu...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <Header />
            <div className="pt-24 px-6 pb-12 space-y-8">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    &larr; Quay lại Dashboard
                </button>

                <h1 className="text-3xl font-extrabold text-purple-700 mt-4">{stats?.title}</h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                    <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
                        <span className="text-sm opacity-80">Tổng lượt xem</span>
                        <span className="text-2xl font-bold">{stats?.totalViews}</span>
                    </div>
                    <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
                        <span className="text-sm opacity-80">Tổng lượt thích</span>
                        <span className="text-2xl font-bold">{stats?.totalLikes}</span>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
                        <span className="text-sm opacity-80">Trạng thái</span>
                        <span className="text-2xl font-bold">{stats?.status}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 mt-6 overflow-x-auto">
                    <h2 className="font-bold mb-2 text-red-500">Lượt xem theo ngày</h2>
                    <BarChart
                        width={500} // chiều rộng cố định
                        height={300}
                        data={
                            dailyViews
                                ? dailyViews
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                    .slice(-7)
                                : []
                        }
                        barCategoryGap={20} // khoảng cách giữa các cột
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8ab619" />
                    </BarChart>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 mt-6 overflow-x-auto">
                    <h2 className="font-bold mb-2 text-red-500">Lượt thích theo ngày</h2>
                    <BarChart
                        width={500}
                        height={300}
                        data={
                            dailyLikes
                                ? dailyLikes
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                    .slice(-7)
                                : []
                        }
                        barCategoryGap={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#24be3c" />
                    </BarChart>
                </div>


            </div>
        </div>
    );
}
