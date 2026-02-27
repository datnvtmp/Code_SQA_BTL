import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Article {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  image?: string;
}

const CACHE_KEY = 'rssAmThucCache3';
const CACHE_DURATION = 1000 * 60 * 500; // 500 phút

const RSSAmThucGrid: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        // Kiểm tra cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setArticles(data);
            setLoading(false);
            return;
          }
        }
        // Nếu không có cache hoặc cache hết hạn
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_DATA}/api/rss-amthuc`);
        if (!res.ok) throw new Error('Không lấy được dữ liệu từ server');
        const data: Article[] = await res.json();

        setArticles(data);
        // Lưu vào cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p className="text-center py-8">Đang tải dữ liệu ẩm thực...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="py-12 px-4 sm:px-16">
      <h2 className="text-2xl font-bold mb-6">Tin tức về ẩm thực và dinh dưỡng mới</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <a
            key={idx}
            href={art.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded-lg shadow hover:shadow-lg transition-all bg-white overflow-hidden"
          >
            {art.image && (
              <div className="relative w-full h-48">
                <Image unoptimized
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority={idx < 3}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{art.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(art.pubDate).toLocaleDateString()}{' '}
                {new Date(art.pubDate).toLocaleTimeString()}
              </p>
              {art.contentSnippet && <p className="text-gray-700">{art.contentSnippet}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RSSAmThucGrid;
