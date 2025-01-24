'use client';

import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { FAMILY_COLORS, FAMILY_MEMBERS } from '@/constants/family';
import { FamilyReviews as FamilyReviewsType } from '@/types/family';

interface FamilyReviewsProps {
  reviews: FamilyReviewsType;
}

export function FamilyReviews({ reviews }: FamilyReviewsProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>家族の感想</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {FAMILY_MEMBERS.map(member => (
            <div key={member.id} className="flex items-start gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback 
                  style={{ 
                    backgroundColor: FAMILY_COLORS[member.id].background, 
                    color: FAMILY_COLORS[member.id].primary 
                  }}
                >
                  {member.displayName}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{member.nickname}</p>
                <div 
                  className="rounded-lg p-4" 
                  style={{ backgroundColor: FAMILY_COLORS[member.id].background }}
                >
                  <p>{reviews[member.id] || 'レビューはまだありません'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
