// src/app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '../app/components/ui/toast';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '家族で観る映画レビュー',
  description: '家族みんなの視点で映画をレビュー',
  verification: {
    google: 'あなたのGoogle Search Console確認用メタタグ',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <meta name="google-site-verification" content="qfkItQ8yqFGUHaV4WJ_ZSd_4E_aaIMK9XQNv3iqaFGE" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}