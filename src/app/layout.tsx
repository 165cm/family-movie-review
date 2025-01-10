// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '../app/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '家族で観る映画レビュー',
  description: '家族みんなの視点で映画をレビュー',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <ToastProvider>
          {children}
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  );
}