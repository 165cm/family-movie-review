// src/app/movies/filters/TagFilter.tsx
import React from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { FilterType, FilterTags } from '@/app/lib/filters/types';

interface TagFilterProps {
  tags: FilterTags;
  onFilter: (type: FilterType, value: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ tags, onFilter }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button variant="outline" className="w-full md:w-auto">
            <Tag className="w-4 h-4 mr-2" />
            フィルター
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">監督</h4>
            <div className="flex flex-wrap gap-2">
              {tags.directors.map((director: string) => (
                <Button
                  key={director}
                  variant="outline"
                  size="sm"
                  onClick={() => onFilter('director', director)}
                  className="text-sm"
                >
                  {director}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">脚本</h4>
            <div className="flex flex-wrap gap-2">
              {tags.screenwriters.map((screenwriter: string) => (
                <Button
                  key={screenwriter}
                  variant="outline"
                  size="sm"
                  onClick={() => onFilter('screenwriter', screenwriter)}
                  className="text-sm"
                >
                  {screenwriter}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">出演者</h4>
            <div className="flex flex-wrap gap-2">
              {tags.cast.map((actor: string) => (
                <Button
                  key={actor}
                  variant="outline"
                  size="sm"
                  onClick={() => onFilter('cast', actor)}
                  className="text-sm"
                >
                  {actor}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};