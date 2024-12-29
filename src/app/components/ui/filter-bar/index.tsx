// src/components/ui/filter-bar/index.tsx
'use client';

import React from 'react';

export interface FilterBarProps {
  className?: string;
  onFilterChange?: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  platform: string;
  rating: string;
  isBest5: boolean;
}

export function FilterBar({ 
  className = '',
  onFilterChange 
}: FilterBarProps) {
  const [filters, setFilters] = React.useState<FilterOptions>({
    platform: 'all',
    rating: 'all',
    isBest5: false
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className={`flex flex-wrap gap-4 mb-6 ${className}`}>
      <select 
        value={filters.platform}
        onChange={(e) => handleFilterChange('platform', e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
      >
        <option value="all">配信サービスを選択</option>
        <option value="netflix">Netflix</option>
        <option value="amazon">Amazonプライム</option>
        <option value="disney">Disney+</option>
      </select>

      <select
        value={filters.rating}
        onChange={(e) => handleFilterChange('rating', e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
      >
        <option value="all">評価で絞り込み</option>
        <option value="father">父のおすすめ</option>
        <option value="mother">母のおすすめ</option>
        <option value="children">子どものおすすめ</option>
      </select>

      <button
        onClick={() => handleFilterChange('isBest5', !filters.isBest5)}
        className={`px-4 py-2 rounded-full font-medium transition-colors ${
          filters.isBest5 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        BEST5のみ
      </button>
    </div>
  );
}