import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '../app/components/ui/toast';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '家族で観る映画レビュー',
  description: '家族みんなの視点で映画をレビュー',
  verification: {
    google: 'zand30Xj_kS4zbsIOw-yZ_zZCyKK2dwW8r3D_lCmz-Y',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '家族で観る映画レビュー',
    description: '家族みんなの視点で映画をレビュー',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: '家族で観る映画レビュー',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '家族で観る映画レビュー',
    description: '家族みんなの視点で映画をレビュー',
  },
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
        </ToastProvider>
      </body>
    </html>
  );
}