'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { FC } from 'react';
const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

interface FoodItem {
    id: string;
    title: string;
    imageUrl: string;
}

const FoodChatbot: FC = () => {
    const [userMsg, setUserMsg] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [response, setResponse] = useState('');
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!userMsg && !image) return;

        setLoading(true);
        setResponse('');
        setFoods([]);

        const formData = new FormData();
        if (userMsg) formData.append('userMsg', userMsg);
        if (image) formData.append('image', image);
        formData.append('toolNumbers', '1');

        try {
            const res = await fetch(
                `${API_HOST}/api/test/chatbot-with-tool-response`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const json = await res.json();
            setResponse(json?.data?.response || 'Không có phản hồi.');

            const hits = json?.data?.vectorSearchDTO?.result?.hits || [];

            const mappedFoods: FoodItem[] = hits.map((item: any) => {
                const rawUrl = item.fields?.imageUrl || '';
                return {
                    id: item.id,
                    title: item.fields?.title,
                    imageUrl: rawUrl.startsWith('http')
                        ? rawUrl
                        : `${API_HOST}${rawUrl}`,
                };
            });

            setFoods(mappedFoods);
        } catch {
            setResponse('❌ Có lỗi xảy ra khi gọi API.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" xl:px-4 flex flex-col h-full bg-[#FAF7F2] xl:rounded-xl overflow-hidden ">
            {/* Header */}
            <div className="px-4 py-3 bg-customPrimary text-white font-semibold">
                🍳 Hỏi đáp gợi ý món ăn
            </div>

            {/* Input */}
            <div className="p-3 border-b bg-white flex items-center gap-2">
                <label className="cursor-pointer">
                    📷
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                    />
                </label>

                <input
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    placeholder="Hỏi món ăn, nguyên liệu, cách nấu..."
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-customPrimary text-white px-4 py-2 rounded-full disabled:opacity-50"
                >
                    ➤
                </button>
            </div>

            {/* Content */}
            <div className="flex-1  p-4 space-y-4">
                {preview && (
                    <div className="flex justify-end">
                        <div className="bg-white rounded-xl p-2 shadow max-w-[220px]">
                            <Image
                                src={preview}
                                alt="food"
                                width={200}
                                height={200}
                                className="rounded-lg object-cover"
                            />
                        </div>
                    </div>
                )}

                {userMsg && (
                    <div className="flex justify-end">
                        <div className="bg-customPrimary text-white px-4 py-2 rounded-2xl max-w-[80%]">
                            {userMsg}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="bg-white px-4 py-2 rounded-2xl shadow w-fit animate-pulse">
                        🤖 Đang phân tích món ăn...
                    </div>
                )}

                {/* BOT RESPONSE */}
                {response && (
                    <div
                className="
                    bg-white px-4 py-3 rounded-2xl shadow
                    max-w-full overflow-x-auto
                    prose prose-sm

                    [&_table]:!border
                    [&_table]:!border-gray-300
                    [&_table]:!border-separate
                    [&_table]:!border-spacing-0

                    [&_th]:!border
                    [&_th]:!border-gray-300
                    [&_th]:bg-gray-100
                    [&_th]:font-semibold
                    [&_th]:p-2

                    [&_td]:!border
                    [&_td]:!border-gray-300
                    [&_td]:p-2
                "
                >

                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {response}
                        </ReactMarkdown>
                    </div>
                )}


                {/* FOOD LIST */}
                {foods.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2">
                            🍽️ Món ăn phù hợp
                        </h3>

                        <div className="grid grid-cols-3 xl:grid-cols-5 gap-3">
                            {foods.map((food) => (
                                <a
                                    key={food.id}
                                    href={`/food-detail?id=${food.id}`}
                                    className="bg-white rounded-xl shadow overflow-hidden hover:scale-[1.02] transition"
                                >
                                    <img
                                        src={food.imageUrl}
                                        alt={food.title}
                                        className="w-full h-[120px] object-cover"
                                        loading="lazy"
                                    />
                                    <div className="p-2 text-sm font-medium">
                                        {food.title}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodChatbot;
