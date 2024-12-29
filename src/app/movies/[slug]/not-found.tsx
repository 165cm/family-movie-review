// src/app/movies/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        ページが見つかりません
      </h1>
      <p className="text-gray-600 mb-6">
        お探しの映画レビューは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}