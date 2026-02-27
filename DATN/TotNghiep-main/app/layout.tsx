import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@providers/QueryProvider';
import Footer from '@/components/Common/Footer';

export const metadata: Metadata = {
  title: 'CookPad Web',
  description: 'Migrated to Next.js + TailwindCSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-dvh flex flex-col bg-white text-gray-900 antialiased">
        <QueryProvider>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
