export type FamilyMember = 'father' | 'mother' | 'bigSister' | 'littleSister';

export type FamilyScores = {
  [key in FamilyMember]: number;
};

export type FamilyReviews = {
  [key in FamilyMember]: string;
};

export type FamilyMemberInfo = {
  id: FamilyMember;
  displayName: string;
  nickname: string;
};
