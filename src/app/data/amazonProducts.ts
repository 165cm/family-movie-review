// src/data/amazonProducts.ts
import { AmazonProduct } from '@/types/amazon';

export const amazonProducts: Record<string, AmazonProduct> = {
  'projector': {
    asin: 'B0DG1KVLYY',
    title: 'Billos プロジェクター BSK01',
    price: {
      amount: 12999,
      currency: 'JPY'
    },
    imageUrls: {
      small: '/images/products/projector-small.jpg',
      medium: '/images/products/projector-medium.jpg',
      large: '/images/products/projector-large.jpg'
    },
    detailPageUrl: 'https://amzn.to/40Alwj1',
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
},
'popcorn-maker': {
  asin: 'B0C439C1T9',
  title: 'créer ポップコーンメーカー',
  price: {
    amount: 1980,
    currency: 'JPY'
  },
  imageUrls: {
    small: '/images/products/popcorn-small.jpg',
    medium: '/images/products/popcorn-medium.jpg',
    large: '/images/products/popcorn-large.jpg'
  },
  detailPageUrl: 'https://amzn.to/3EaDlhf',
  copies: {
    a: {
      heading: "映画と一緒に楽しむ！電子レンジで簡単手作りポップコーン",
      subheading: "9種のレシピ付き！食洗機対応で後片付けも簡単、毎日の映画タイムがもっと楽しくなる"
    },
    b: {
      heading: "映画鑑賞がもっと楽しくなる！手作りポップコーンメーカー",
      subheading: "レンジでチンするだけの簡単調理。お好みのフレーバーで特別な映画タイムを"
    }
  },
  reviews: {
    bigSister: "クラスの友達と映画会するとき、これで作ったポップコーンめっちゃウケた！",
    littleSister: "自分で作れるの超楽しい！キャラメル味作ったら、お父さんにめっちゃ褒められた～！",
    father: "シリコン製で収納も場所を取らず、レシピも豊富で子供たちが自主的に作れるのが◎",
    mother: "子どもたちが自分で作れて、片付けも簡単なのが嬉しい。映画の時間がより特別になりました"
  },
  genre: 'キッチン家電'
},
'fire-stick': {
  asin: 'B09BS1ZB3F',
  title: 'Amazon Fire TV Stick HD',
  price: {
    amount: 6980,
    currency: 'JPY'
  },
  imageUrls: {
    small: '/images/products/projector-small.jpg',
    medium: '/images/products/projector-medium.jpg',
    large: '/images/products/projector-large.jpg'
  },
  detailPageUrl: 'https://amzn.to/3Cs2yTS',
  copies: {
    a: {
      heading: "あらゆる動画配信サービスを、もっと快適に！",
      subheading: "Alexa対応リモコンで音声検索も簡単。Prime Video、Netflix、YouTube等を大画面で"
    },
    b: {
      heading: "テレビでプライムビデオやNetflixを快適視聴！",
      subheading: "60万作品以上が見放題。Alexa対応リモコンで見たい作品をすぐに検索"
    }
  },
  reviews: {
    bigSister: "数学の動画とか、勉強にも使えるし、アニメも見やすい！声で検索できるの超便利！",
    littleSister: "リモコンに話しかけるの楽しい！ディズニーの映画もYouTubeも見れて最高♪",
    father: "各種動画配信サービスを一元管理できて便利。Alexaとの連携で話しかけるだけ👍",
    mother: "操作が簡単で、私でも迷わず使えます。子供の教育番組も豊富で助かります(*^^*)"
  },
  genre: 'デジタル機器'
}
};