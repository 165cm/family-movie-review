// src/app/not-found.tsx
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            ページが見つかりません
          </h2>
          <p className="text-gray-500 mb-8">
            申し訳ありませんが、お探しのページは存在しないか、移動した可能性があります。
          </p>
          <Link 
            href="/movies" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            映画一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}