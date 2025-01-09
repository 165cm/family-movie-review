// src/app/components/ui/age-recommendation/index.tsx
import { AgeGroupRating } from '@/types/movie';

export function AgeRecommendation({ ageGroups }: { ageGroups: AgeGroupRating[] }) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {ageGroups.map((group) => (
        <div key={group.ageGroup} className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-full ${group.isRecommended ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
            <span className="text-sm font-medium">{group.ageGroup}</span>
          </div>
          {group.warning && <span className="text-xs text-red-500 mt-1">{group.warning}</span>}
        </div>
      ))}
    </div>
  );
}