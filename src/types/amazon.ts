// src/types/amazon.ts
export interface AmazonProduct {
  asin: string;
  title: string;
  price: {
    amount: number;
    currency: string;
  };
  imageUrls: {
    small: string;
    medium: string;
    large: string;
  };
  detailPageUrl: string;
  reviews: {
    father: string;
    mother: string;
    bigSister: string;
    littleSister: string;
  };
  copies: {
    a: {
      heading: string;
      subheading: string;
    };
    b: {
      heading: string;
      subheading: string;
    };
  };
  genre: string;
}