import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ClientLayout from './clientLayout';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Order Management',
  description: 'Role-based e-commerce order management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'bg-gray-900 text-white shadow-lg rounded-lg px-4 py-3',
            duration: 4000,
            style: {
              maxWidth: '380px',
            },
            success: {
              className: 'bg-green-600 text-white',
            },
            error: {
              className: 'bg-red-600 text-white',
            },
          }}/>
      </body>
    </html>
  );
}