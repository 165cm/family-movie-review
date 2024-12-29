// src/app/lib/theme.ts

/**
 * 家族メンバーごとのカラー設定
 * - primary: メインカラー（文字色など）
 * - background: 背景色（20%透明度）
 * - border: ボーダー色（30%透明度）
 */
export const familyColors = {
    father: {
      primary: '#06911B',
      background: '#06911B1A', // hex + 10% opacity
      border: '#06911B33'      // hex + 20% opacity
    },
    mother: {
      primary: '#BC27FF',
      background: '#BC27FF1A',
      border: '#BC27FF33'
    },
    bigSister: {
      primary: '#27C3FF',
      background: '#27C3FF1A',
      border: '#27C3FF33'
    },
    littleSister: {
      primary: '#FF3EFD',
      background: '#FF3EFD1A',
      border: '#FF3EFD33'
    }
  } as const;
  
  // 型定義のエクスポート
  export type FamilyMember = keyof typeof familyColors;
  
  // カラー関連のユーティリティ関数
  export const getFamilyColor = (member: FamilyMember, type: keyof typeof familyColors[FamilyMember] = 'primary') => {
    return familyColors[member][type];
  };