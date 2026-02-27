'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import Header from '@components/Common/Header';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_DATA;

/* =======================
   Types
======================= */
interface AboutItem {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
}

/* =======================
   Page
======================= */
const AboutPage = () => {
    const {
        data: aboutData = [],
        isLoading,
        isError,
    } = useQuery<AboutItem[]>({
        queryKey: ['about-page'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/api/about`);
            if (!res.ok) throw new Error('Fetch failed');

            const json = await res.json();
            return json?.success ? json.data : [];
        },
        staleTime: 1000 * 60 * 10,
    });

    return (
        <>
            <Header />
            <div className="bg-[#FAF7F2] pt-16">

                {/* ===== HERO ===== */}
                <section className="relative h-[60vh] flex items-center justify-center">
                    <Image
                        src="https://picsum.photos/1600/900?food=hero"
                        alt="About hero"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />

                    <div className="relative z-10 text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Về Chúng Tôi
                        </h1>
                        <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
                            Lan tỏa đam mê nấu ăn và gìn giữ hương vị Việt
                        </p>
                    </div>
                </section>

                {/* ===== CONTENT ===== */}
                <section className="max-w-7xl mx-auto px-6 py-16 space-y-20">

                    {isLoading && (
                        <p className="text-center text-gray-500">
                            Đang tải nội dung giới thiệu...
                        </p>
                    )}

                    {isError && (
                        <p className="text-center text-red-500">
                            Không thể tải trang giới thiệu
                        </p>
                    )}

                    {!isLoading &&
                        aboutData.map((item, index) => {
                            const reverse = index % 2 !== 0;

                            return (
                                <div
                                    key={item.id}
                                    className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
                                        } items-center gap-10`}
                                >
                                    {/* Image */}
                                    <div className="w-full lg:w-1/2">
                                        <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-lg">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Text */}
                                    <div className="w-full lg:w-1/2 space-y-4">
                                        <h2 className="text-3xl font-bold text-gray-800">
                                            {item.title}
                                        </h2>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            {item.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </section>

                {/* ===== CTA ===== */}
                <section className="bg-orange-500 py-16">
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <h2 className="text-3xl font-bold text-white">
                            Cùng nhau xây dựng cộng đồng yêu bếp
                        </h2>
                        <p className="mt-4 text-white/90 text-lg">
                            Chia sẻ công thức – Lan tỏa yêu thương – Gắn kết gia đình
                        </p>

                        <Link href="/">
                            <button className="mt-8 px-8 py-3 bg-white text-orange-500 font-semibold rounded-full hover:bg-gray-100 transition">
                                Khám phá công thức ngay
                            </button>
                        </Link>
                    </div>
                </section>
            </div></>

    );
};

export default AboutPage;
