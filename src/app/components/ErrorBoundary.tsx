// src/app/components/ErrorBoundary.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

type ErrorBoundaryProps = {
  error: Error;
  resetAction: () => void;  // resetをresetActionに変更
};

export default function ErrorBoundary({
  error,
  resetAction,
}: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Error details:', error);
  }, [error]);

  const handleReset = async () => {
    try {
      await resetAction();
    } catch (e) {
      console.error('Reset failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          エラーが発生しました
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'データの取得中にエラーが発生しました。'}
        </p>
        <div className="flex justify-between">
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          トップページへ戻る
        </Link>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    </div>
  );
}