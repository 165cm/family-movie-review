import { FamilyMemberInfo } from '@/types/family';

export const FAMILY_MEMBERS: FamilyMemberInfo[] = [
  { id: 'father', displayName: '父', nickname: '論理派パパ' },
  { id: 'mother', displayName: '母', nickname: '共感派ママ' },
  { id: 'bigSister', displayName: '姉', nickname: '探究派お姉ちゃん' },
  { id: 'littleSister', displayName: '妹', nickname: '好奇心旺盛な妹' },
];

export const FAMILY_COLORS = {
  father: {
    background: '#E3F2FD',
    primary: '#1976D2',
  },
  mother: {
    background: '#F3E5F5',
    primary: '#9C27B0',
  },
  bigSister: {
    background: '#FFF3E0',
    primary: '#FF9800',
  },
  littleSister: {
    background: '#E8F5E9',
    primary: '#4CAF50',
  },
} as const;
