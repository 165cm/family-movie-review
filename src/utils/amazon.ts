// src/utils/amazon.ts
import { PaApiCredentials, PaApiProduct, ApiError, ApiResponse } from '@/types/paapi';
import { sign } from '@/app/lib/utils/signature';
import { productCache } from '@/utils/cache';

// プライベート定数の定義
const PAAPI_SERVICE = 'paapi5';
const PAAPI_PATH = 'GetItems';

export class AmazonApiClient {
  private credentials: PaApiCredentials;
  
  constructor(credentials: PaApiCredentials) {
    this.credentials = credentials;
  }

  async getProductInfo(asin: string): Promise<PaApiProduct> {
    try {
      const payload = {
        ItemIds: [asin],
        Resources: [
          'Images.Primary.Small',
          'Images.Primary.Medium',
          'Images.Primary.Large',
          'ItemInfo.Title',
          'Offers.Listings.Price'
        ],
        PartnerTag: this.credentials.associateTag,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.co.jp'
      };

      console.log('Request payload:', JSON.stringify(payload, null, 2));
      
      const response = await this.makeRequest(PAAPI_PATH, payload);
      console.log('API Response:', JSON.stringify(response, null, 2));

      return this.transformResponse(response);
    } catch (error) {
      console.error('PA-API error:', error);
      throw this.handleError(error);
    }
  }

  async getProductWithCache(asin: string): Promise<PaApiProduct> {
    const cacheKey = `product:${asin}`;
    const cachedProduct = productCache.get(cacheKey);
    
    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.getProductInfo(asin);
    productCache.set(cacheKey, product);
    
    return product;
  }

  private async makeRequest(path: string, payload: Record<string, unknown>): Promise<ApiResponse> {
    const timestamp = new Date().toISOString();
    const signature = sign({
      secretKey: this.credentials.secretKey,
      region: this.credentials.region,
      service: PAAPI_SERVICE,
      path,
      target: `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${path}`,
      timestamp,
      payload: JSON.stringify(payload)
    });

    const response = await fetch(`https://webservices.amazon.co.jp/paapi5/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Amz-Date': timestamp,
        'Authorization': `AWS4-HMAC-SHA256 Credential=${this.credentials.accessKeyId}/${timestamp.split('T')[0].replace(/-/g, '')}/${this.credentials.region}/${PAAPI_SERVICE}/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=${signature}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`PA-API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private transformResponse(response: ApiResponse): PaApiProduct {
    const item = response.ItemsResult.Items[0];
    const fallbackUrl = '/images/no-image.png';
    
    const images = item.Images?.Primary;
    const imageUrls = {
      small: images?.Small?.URL || fallbackUrl,
      medium: images?.Medium?.URL || fallbackUrl,
      large: images?.Large?.URL || fallbackUrl
    };

    return {
      asin: item.ASIN,
      title: item.ItemInfo.Title.DisplayValue,
      price: {
        amount: parseFloat(item.Offers.Listings[0].Price.Amount),
        currency: item.Offers.Listings[0].Price.Currency
      },
      imageUrls,
      detailPageUrl: item.DetailPageURL
    };
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        code: 'REQUEST_ERROR',
        message: error.message
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: '予期せぬエラーが発生しました'
    };
  }
}