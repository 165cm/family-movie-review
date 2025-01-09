// src/app/error.tsx (確認)
'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-4">
        <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
        <p className="text-gray-600 mb-4">データの読み込みに失敗しました。</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          再試行
        </button>
      </div>
    </div>
  );
}