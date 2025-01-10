// src/app/movies/filters/FilterBar.tsx
import { useState } from 'react';
import { SearchBox } from './SearchBox';
import { SortSelect } from './SortSelect';
import { SortOption } from '@/app/lib/filters/types';

interface FilterBarProps {
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onSort
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState<SortOption>('totalScore');  // デフォルト値を変更

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleSort = (value: SortOption) => {
    setSortValue(value);
    onSort(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <SearchBox value={searchValue} onChange={handleSearch} />
      </div>
      <div className="w-full md:w-48">
        <SortSelect value={sortValue} onChange={handleSort} />
      </div>
    </div>
  );
};