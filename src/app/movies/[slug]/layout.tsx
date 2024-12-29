// src/app/movies/[slug]/layout.tsx
export default function MovieLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }