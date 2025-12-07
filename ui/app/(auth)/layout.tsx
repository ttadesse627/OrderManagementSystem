import type { Metadata } from 'next';
import { StoreProvider } from '@/contexts/StoreContext';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Login or signup to your account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-50 py-12">
        {children}
      </div>
    </StoreProvider>
  );
}