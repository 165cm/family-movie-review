// src/app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="animate-pulse h-12 bg-gray-100 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }