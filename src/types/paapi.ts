// src/types/paapi.ts
// 1. 認証関連
export interface PaApiCredentials {
  accessKeyId: string;
  secretKey: string;
  associateTag: string;
  region: string;
}

// 2. 画像関連
export interface PaApiImageSize {
  URL: string;
  Height: number;
  Width: number;
}

export interface PaApiImages {
  Primary: {
    Small?: PaApiImageSize;
    Medium?: PaApiImageSize;
    Large?: PaApiImageSize;
  };
  Variants?: Array<{
    Small?: PaApiImageSize;
    Medium?: PaApiImageSize;
    Large?: PaApiImageSize;
  }>;
}

// 3. 商品関連
export interface PaApiItem {
  ASIN: string;
  DetailPageURL: string;
  ItemInfo: {
    Title: {
      DisplayValue: string;
    };
    ByLineInfo?: {
      Contributors?: Array<{
        Role: string;
        Name: string;
      }>;
    };
    ContentInfo?: {
      Languages?: Array<{
        DisplayValue: string;
      }>;
      Edition?: {
        DisplayValue: string;
      };
      PagesCount?: {
        DisplayValue: number;
      };
    };
    ProductInfo?: Record<string, unknown>;
  };
  Offers: {
    Listings: Array<{
      Price: {
        Amount: string;
        Currency: string;
      };
      DeliveryInfo?: {
        IsPrimeEligible?: boolean;
      };
    }>;
  };
  Images?: PaApiImages;
  BrowseNodeInfo?: {
    BrowseNodes: Array<{
      Id: string;
      DisplayValue: string;
      ContextFreeName?: string;
    }>;
    WebsiteSalesRank?: {
      SalesRank: number;
    };
  };
}

// 4. API応答
export interface ApiResponse {
  ItemsResult: {
    Items: PaApiItem[];
  };
}

// 5. 変換後の商品データ
export interface PaApiProduct {
  asin: string;
  title: string;
  price: {
    amount: number;
    currency: string;
    isPrime?: boolean;
  };
  imageUrls: {
    small: string;
    medium: string;
    large: string;
    variants?: {
      small: string;
      medium: string;
      large: string;
    };
  };
  detailPageUrl: string;
  category?: {
    id: string;
    name: string;
    contextFreeName?: string;
    salesRank?: number;
  };
  contributors?: Array<{
    role: string;
    name: string;
  }>;
  content?: {
    languages?: string[];
    edition?: string;
    pages?: number;
  };
  productInfo?: Record<string, unknown>;
}

// 6. エラー
export interface ApiError {
  code: string;
  message: string;
}