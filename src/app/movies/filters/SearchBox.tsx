import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="search"
        placeholder="映画のタイトルで検索..."
        className="pl-10"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};