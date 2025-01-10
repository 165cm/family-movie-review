// src/app/components/MovieFilterFooter/index.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { SortOption } from '@/app/lib/filters/types';

interface MovieFilterFooterProps {
  onSearch: (term: string) => void;
  onSort: (sortBy: SortOption) => void;
}

export const MovieFilterFooter: React.FC<MovieFilterFooterProps> = ({
  onSearch,
  onSort
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* 検索バー */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="search"
              placeholder="タイトルで検索..."
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* ソート選択 */}
          <select
            onChange={(e) => onSort(e.target.value as SortOption)}
            className="px-4 py-2 border rounded-full text-gray-600 bg-white hover:bg-gray-50"
          >
            <option value="totalScore">総合評価順</option>
            <option value="fatherScore">父の評価順</option>
            <option value="motherScore">母の評価順</option>
            <option value="bigSisterScore">姉の評価順</option>
            <option value="littleSisterScore">妹の評価順</option>
          </select>
        </div>
      </div>
    </div>
  );
};