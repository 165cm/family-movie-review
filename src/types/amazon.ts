// src/types/amazon.ts
export interface FamilyReview {
    father: string;
    mother: string;
    bigSister: string;
    littleSister: string;
  }
  
  export interface AmazonProduct {
    asin: string;
    title: string;
    price: number;
    affiliateUrl: string;
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
    reviews: FamilyReview;
  }