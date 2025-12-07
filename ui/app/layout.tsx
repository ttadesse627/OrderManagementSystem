import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { StoreProvider } from '@/contexts/StoreContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Order Management System',
  description: 'Simple order management system with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}