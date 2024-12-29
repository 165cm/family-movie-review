// src/app/movies/[slug]/error.tsx
'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-red-600">
        映画情報の取得中にエラーが発生しました
      </h1>
      <p className="mt-4">
        しばらく時間をおいて再度お試しください。
      </p>
      <button
        onClick={reset}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        再試行
      </button>
    </div>
  );
}