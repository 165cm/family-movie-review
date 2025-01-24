'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

interface MovieSynopsisAndHighlightsProps {
  synopsis: string | null;
  highlights: string[];
}

export function MovieSynopsisAndHighlights({ synopsis, highlights }: MovieSynopsisAndHighlightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>あらすじ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {synopsis ?? 'あらすじはまだ登録されていません。'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>見どころ</CardTitle>
        </CardHeader>
        <CardContent>
          {highlights && highlights.length > 0 ? (
            <ul className="space-y-2">
              {highlights.map((highlight: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">見どころはまだ登録されていません。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
