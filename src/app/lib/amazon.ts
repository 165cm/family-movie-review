// src/app/lib/amazon.ts
import { PaApiCredentials, PaApiProduct, ApiError, ApiResponse } from '@/types/paapi';
import { sign } from '@/app/lib/utils/signature';
import { productCache } from '@/utils/cache';
import { AMAZON_CONFIG } from '../config/amazon';


// ApiResponseの型を拡張
interface ExtendedApiResponse extends ApiResponse {
  readonly status?: number;
  readonly headers?: Headers;
}

export class AmazonApiClient {
  // クラスの静的プロパティとして定義
  private static readonly PAAPI_VERSION = 'Paapi5';
  private static readonly PAAPI_SERVICE = 'ProductAdvertisingAPI';
  private static readonly PAAPI_DOMAIN = 'webservices.amazon.co.jp';
  private static readonly PAAPI_PATH = 'GetItems';
  private static readonly FALLBACK_IMAGE = '/images/fallback/no-image.png';

  private credentials: PaApiCredentials;

  // 画像URLの安全な取得と最適化
  private getImageUrl(): string {
    return AmazonApiClient.FALLBACK_IMAGE;
  }
  
  constructor(credentials: PaApiCredentials) {
    this.credentials = credentials;
  }

  private async getProductInfo(asin: string): Promise<PaApiProduct> {
    try {
      // リクエストパラメータを明示的に定義
      const params = {
        ItemIds: [asin],
        Resources: [
          // 画像関連
          'Images.Primary.Small',
          'Images.Primary.Medium',
          'Images.Primary.Large',
          'Images.Variants.Small',
          'Images.Variants.Medium',
          'Images.Variants.Large',
          
          // 商品情報
          'ItemInfo.Title',
          'ItemInfo.ByLineInfo',
          'ItemInfo.ContentInfo',
          'ItemInfo.ProductInfo',
          
          // 価格情報
          'Offers.Listings.Price',
          'Offers.Listings.DeliveryInfo.IsPrimeEligible',
          
          // カテゴリ情報
          'BrowseNodeInfo.BrowseNodes',
          'BrowseNodeInfo.WebsiteSalesRank'
        ],
        PartnerTag: this.credentials.associateTag,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.co.jp'
      };
  
      // リクエスト前のデバッグログ
      console.log('PA-API Request:', {
        operation: 'GetItems',
        params: JSON.stringify(params, null, 2)
      });
  
      const response = await this.makeRequest('GetItems', params);
  
      // レスポンスの詳細なデバッグ
      console.log('PA-API Response:', {
        statusCode: response.status,
        headers: response.headers,
        body: JSON.stringify(response, null, 2)
      });
  
      if (!response.ItemsResult?.Items?.[0]) {
        throw new Error(`Product not found for ASIN: ${asin}`);
      }
  
      const item = response.ItemsResult.Items[0];

      // 価格情報の取得
      const listing = item.Offers.Listings[0];
      const price = {
        amount: parseFloat(listing.Price.Amount),
        currency: listing.Price.Currency,
        isPrime: listing.DeliveryInfo?.IsPrimeEligible || false
      };

      // カテゴリ情報の取得
      const browseNode = item.BrowseNodeInfo?.BrowseNodes?.[0];
      const category = browseNode ? {
        id: browseNode.Id,
        name: browseNode.DisplayValue,
        contextFreeName: browseNode.ContextFreeName,
        salesRank: item.BrowseNodeInfo?.WebsiteSalesRank?.SalesRank
      } : undefined;

      // 作者情報の取得
      const contributors = item.ItemInfo.ByLineInfo?.Contributors?.map(c => ({
        role: c.Role,
        name: c.Name
      })) || [];

      // コンテンツ情報の取得
      const contentInfo = item.ItemInfo.ContentInfo;
      const content = contentInfo ? {
        languages: contentInfo.Languages?.map(l => l.DisplayValue),
        edition: contentInfo.Edition?.DisplayValue,
        pages: contentInfo.PagesCount?.DisplayValue
      } : undefined;

      const FALLBACK_IMAGE = '/images/fallback/no-image.png';
   
      // 画像URLの安全な取得と最適化
      const getImageUrl = (size: 'Small' | 'Medium' | 'Large', imageType: 'Primary' | 'Variant' = 'Primary'): string => {
        const images = imageType === 'Primary'
          ? item.Images?.Primary
          : item.Images?.Variants?.[0];
        const validatedUrl = this.validateImageUrl(images?.[size]?.URL, size);
        return validatedUrl || FALLBACK_IMAGE;
      };

      return {
        asin: item.ASIN,
        title: item.ItemInfo.Title.DisplayValue,
        price,
        imageUrls: {
          small: getImageUrl('Small'),
          medium: getImageUrl('Medium'),
          large: getImageUrl('Large'),
          variants: {
            small: getImageUrl('Small', 'Variant'),
            medium: getImageUrl('Medium', 'Variant'),
            large: getImageUrl('Large', 'Variant')
          }
        },
        detailPageUrl: item.DetailPageURL,
        category,
        contributors,
        content,
        productInfo: item.ItemInfo.ProductInfo
      };
    } catch (error) {
      console.error('PA-API Error:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      throw this.handleError(error);
    }
  }

  /**
   * 画像URLのバリデーションと最適化
   * @param url 検証する画像URL
   * @param expectedSize 期待する画像サイズ(Small/Medium/Large)
   * @returns 検証済みの画像URL、または代替URL
   */
  private validateImageUrl(url: string | undefined, expectedSize?: 'Small' | 'Medium' | 'Large'): string | null {
    const config = {
      allowedDomains: [
        'images-na.ssl-images-amazon.com',
        'm.media-amazon.com'
      ],
      fallbackUrl: '/images/fallback/no-image.png',
      minWidth: {
        Small: 75,
        Medium: 160,
        Large: 500
      },
      maxRetries: 3,
      validExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    };

    if (!url) {
      console.warn('画像URL未定義のため代替画像を使用します');
      return null;
    }

    try {
      const urlObj = new URL(url);
      
      // ドメインの検証
      if (!config.allowedDomains.includes(urlObj.hostname)) {
        console.error('不正な画像ドメイン:', {
          url,
          hostname: urlObj.hostname,
          allowedDomains: config.allowedDomains
        });
        return null;
      }

      // 拡張子の検証
      const extension = urlObj.pathname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
      if (!extension) {
        console.error('不正な画像拡張子:', {
          url,
          pathname: urlObj.pathname
        });
        return null;
      }

      // 画像サイズのパラメータを解析
      const sizeMatch = url.match(/._SL(\d+)_/);
      if (expectedSize && sizeMatch) {
        const actualWidth = parseInt(sizeMatch[1], 10);
        const minRequiredWidth = config.minWidth[expectedSize];
        
        if (actualWidth < minRequiredWidth) {
          console.warn('画像サイズが要件を満たしていません:', {
            url,
            expectedSize,
            actualWidth,
            minRequiredWidth
          });
          
          try {
            // URLを最適なサイズに調整
            const optimizedUrl = url.replace(
              /._SL\d+_/,
              `._SL${minRequiredWidth}_`
            );
            return optimizedUrl;
          } catch (optimizeError) {
            console.error('画像URL最適化エラー:', {
              url,
              error: optimizeError instanceof Error ? optimizeError.message : '不明なエラー'
            });
            return null;
          }
        }
      }

      // 最終的なURL検証
      const finalUrl = new URL(url);
      if (!finalUrl.protocol.startsWith('http')) {
        console.error('不正なプロトコル:', {
          url,
          protocol: finalUrl.protocol
        });
        return null;
      }

      return url;
    } catch (error) {
      console.error('画像URL検証エラー:', {
        url,
        error: error instanceof Error ? error.message : '不明なエラー',
        stack: error instanceof Error ? error.stack : undefined
      });
      return null;
    }
  }

  async getProductWithCache(asin: string): Promise<PaApiProduct> {
    try {
      const cacheKey = `product:${asin}`;
      const cachedProduct = productCache.get(cacheKey);
      
      if (cachedProduct) {
        return cachedProduct;
      }

      const product = await this.getProductInfo(asin);
      productCache.set(cacheKey, product);
      
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      // フォールバックデータを返す
      return {
        asin,
        title: '商品情報を取得できませんでした',
        price: {
          amount: 0,
          currency: 'JPY',
          isPrime: false
        },
        imageUrls: {
          small: AMAZON_CONFIG.FALLBACK.imageUrl,
          medium: AMAZON_CONFIG.FALLBACK.imageUrl,
          large: AMAZON_CONFIG.FALLBACK.imageUrl,
          variants: {
            small: AMAZON_CONFIG.FALLBACK.imageUrl,
            medium: AMAZON_CONFIG.FALLBACK.imageUrl,
            large: AMAZON_CONFIG.FALLBACK.imageUrl
          }
        },
        detailPageUrl: `https://amazon.co.jp/dp/${asin}`,
        category: {
          id: 'unknown',
          name: '不明なカテゴリ'
        },
        contributors: [],
        content: {
          languages: ['ja'],
          edition: '不明',
          pages: 0
        },
        productInfo: {}
      };
    }
  }

  private generateHeaders(timestamp: string, payload: Record<string, unknown>): Record<string, string> {
    const dateStamp = timestamp.split('T')[0].replace(/-/g, '');
    const scope = `${dateStamp}/${this.credentials.region}/${AmazonApiClient.PAAPI_SERVICE}/aws4_request`;
    const target = `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${AmazonApiClient.PAAPI_PATH}`;
    
    const signature = sign({
      secretKey: this.credentials.secretKey,
      region: this.credentials.region,
      service: AmazonApiClient.PAAPI_SERVICE,
      path: AmazonApiClient.PAAPI_PATH,
      target,
      timestamp,
      payload: JSON.stringify(payload)
    });

    return {
      'Content-Type': 'application/json; charset=utf-8',
      'Host': AmazonApiClient.PAAPI_DOMAIN,
      'X-Amz-Date': timestamp,
      'X-Amz-Target': target,
      'Authorization': [
        'AWS4-HMAC-SHA256',
        `Credential=${this.credentials.accessKeyId}/${scope}`,
        'SignedHeaders=content-type;host;x-amz-date;x-amz-target',
        `Signature=${signature}`
      ].join(' ')
    };
  }

  private async makeRequest(p0: string, payload: Record<string, unknown>): Promise<ExtendedApiResponse> {
    const timestamp = new Date().toISOString();
    const requestPayload = {
      ...payload,
      PartnerTag: this.credentials.associateTag,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.co.jp'
    };

    const headers = this.generateHeaders(timestamp, requestPayload);
    const url = `https://${AmazonApiClient.PAAPI_DOMAIN}/paapi5/${AmazonApiClient.PAAPI_PATH}`;

    console.log('Making request:', {
      method: 'POST',
      url,
      headers,
      payload: requestPayload
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PA-API Error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
        body: errorText
      });
      throw new Error(`PA-API request failed (${response.status}): ${errorText}`);
    }

    return {
      ...(await response.json()),
      status: response.status,
      headers: response.headers
    };
  }

  private transformResponse(response: ApiResponse): PaApiProduct {
    const item = response.ItemsResult.Items[0];
    const listing = item.Offers?.Listings?.[0];
    
    return {
      asin: item.ASIN,
      title: item.ItemInfo.Title.DisplayValue,
      price: {
        amount: listing?.Price?.Amount ? Number(listing.Price.Amount) : 0,
        currency: listing?.Price?.Currency || 'JPY',
        isPrime: false
      },
      imageUrls: {
        small: this.getImageUrl(),
        medium: this.getImageUrl(),
        large: this.getImageUrl(),
        variants: {
          small: this.getImageUrl(),
          medium: this.getImageUrl(),
          large: this.getImageUrl()
        }
      },
      detailPageUrl: item.DetailPageURL,
      category: undefined,
      contributors: [],
      content: undefined,
      productInfo: undefined
    };
  }

  private handleError(error: unknown): ApiError {
    console.error('Handling error:', error);
    
    if (error instanceof Error) {
      return {
        code: 'REQUEST_ERROR',
        message: error.message
      };
    }

    const errorMessage = error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : '予期せぬエラーが発生しました';

    return {
      code: 'UNKNOWN_ERROR',
      message: errorMessage
    };
  }
}