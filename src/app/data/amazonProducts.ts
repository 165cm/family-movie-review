// src/data/amazonProducts.ts
import { AmazonProduct } from '@/types/amazon';

export const amazonProducts: Record<string, AmazonProduct> = {
  'projector': {
    asin: 'B0DG1KVLYY',
    title: 'Billos プロジェクター BSK01',
    price: 12999,
    affiliateUrl: 'https://amzn.to/40Alwj1',
    copies: {
      a: {
        heading: "映画の感動を大画面で！超軽量513gのミニプロジェクター",
        subheading: "最新Android TV搭載で簡単操作。子ども部屋からリビングまで、どこでも大画面シアターに"
      },
      b: {
        heading: "家族の映画時間をもっと特別に。驚きの高画質プロジェクター",
        subheading: "4K対応＆16000ルーメンの美しい映像。壁に映すだけで、そこはもう映画館気分"
      }
    },
    reviews: {
        bigSister: "友達の家でプロジェクター使って映画見たとき、すっごく良かった！スマホの画面より全然没入感が違う！",
        littleSister: "えー！すごーい！お部屋が映画館みたいになるんだ！わたしも欲しい～♪",
        father: "性能と携帯性のバランスが秀逸。4K対応で最新のAndroid TVシステムを搭載でコスパもいいね👍️",
        mother: "家族で映画を見る時間が、もっと特別なものになりそう(*^^*)"
},
    genre: 'ホームシアター'
  }
};