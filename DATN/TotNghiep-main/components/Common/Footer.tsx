'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">🍳 CookPad</h2>
          <p className="text-sm leading-relaxed">
            Nền tảng chia sẻ công thức nấu ăn và bán món ăn trực tuyến,
            phục vụ đồ án tốt nghiệp – xây dựng với Next.js & TailwindCSS.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Liên kết</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link href="/recipes" className="hover:text-white transition">
                Công thức
              </Link>
            </li>
            <li>
              <Link href="/seller" className="hover:text-white transition">
                Bán hàng
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-white transition">
                Cá nhân
              </Link>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Thông tin</h3>
          <ul className="space-y-2 text-sm">
            <li> Đồ án tốt nghiệp CNTT</li>
            <li> Sinh viên thực hiện: Nguyễn Hồng</li>
            <li> Học viện Công nghệ Bưu chính Viễn thông</li>
            <li> Năm: 2026</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CookPad Web. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
