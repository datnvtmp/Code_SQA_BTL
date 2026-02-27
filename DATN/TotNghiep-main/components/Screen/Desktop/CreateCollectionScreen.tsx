"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function CreateCollectionPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/collections/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name,
                    description,
                    public: isPublic,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.message || "Tạo collection thất bại.");
                return;
            }

            setSuccessMsg("Tạo collection thành công!");
            setTimeout(() => router.push("/create/categories/sucess"), 1000);
        } catch (error) {
            setErrorMsg("Lỗi kết nối server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center p-8">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo bảng công thức cho riêng bạn</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Nhập tên collection"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                         focus:ring-orange-400 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            placeholder="Mô tả"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2
                         focus:ring-orange-400 focus:outline-none"
                        ></textarea>
                    </div>

                    {/* Public */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                        />
                        <span className="text-gray-700 text-sm">Public Collection</span>
                    </div>

                    {/* Messages */}
                    {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                    {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white
                       py-2.5 rounded-lg font-semibold shadow transition active:scale-95"
                    >
                        {loading ? "Creating..." : "Create Collection"}
                    </button>
                </form>
            </div>
        </div>
    );
}
