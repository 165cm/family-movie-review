// src/app/movies/filters/SortSelect.tsx
import React from 'react';
import { Select } from '@/app/components/ui/select';
import { SortOption } from '@/app/lib/filters/types';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as SortOption)}>
      <option value="totalScore">総合評価順</option>
      <option value="fatherScore">父の評価順</option>
      <option value="motherScore">母の評価順</option>
      <option value="bigSisterScore">姉の評価順</option>
      <option value="littleSisterScore">妹の評価順</option>
    </Select>
  );
};