// src/app/lib/notion.ts
import { Client } from '@notionhq/client';
import { 
  PageObjectResponse,
  NumberPropertyItemObjectResponse,
  SelectPropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
  StatusPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import { cache } from 'react';
import { Movie, MovieListItem } from '@/types/movie';
import { unstable_cache } from 'next/cache';

// キャッシュキーの定義
const MOVIES_CACHE_KEY = 'movies-data';
const CACHE_TAG = 'movies';

// RichText型の定義
type NotionRichText = {
  type: "text";
  text: {
    content: string;
    link: null | { url: string };
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: null | string;
};

// カスタムプロパティ型の定義
interface NotionPageProperties extends Record<string, unknown> {
  Name: {
    id: string;
    type: "title";
    title: NotionRichText[];
  };
  Slug: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  Synopsis: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  TotalScore: NumberPropertyItemObjectResponse;
  FatherScore: NumberPropertyItemObjectResponse;
  MotherScore: NumberPropertyItemObjectResponse;
  bigsisScore: NumberPropertyItemObjectResponse;
  littlesisScore: NumberPropertyItemObjectResponse;
  FatherReview: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  MotherReview: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  BigSisReview: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  LittleSisReview: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  Director: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  Cast: MultiSelectPropertyItemObjectResponse;
  Screenwriter: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  Highlights: {
    id: string;
    type: "rich_text";
    rich_text: NotionRichText[];
  };
  WatchedDate: DatePropertyItemObjectResponse;
  ViewingPlatform: SelectPropertyItemObjectResponse;
  ViewingUrl: UrlPropertyItemObjectResponse;
  Status: StatusPropertyItemObjectResponse;
  'DB-Month': SelectPropertyItemObjectResponse;
  Check: StatusPropertyItemObjectResponse;  // Checkプロパティを修正
  Genre: SelectPropertyItemObjectResponse;  // Genreプロパティを追加
  Duration: NumberPropertyItemObjectResponse;  // 上映時間を追加
  BEST5: MultiSelectPropertyItemObjectResponse;

  recommendedBy: MultiSelectPropertyItemObjectResponse;  // BEST5をrecommendedByに変更
}

// ヘルパー関数の安全な実装
const getRichTextContent = (property?: { rich_text: NotionRichText[] } | null): string => {
  if (!property?.rich_text?.length) return '';
  return property.rich_text[0]?.plain_text ?? '';
};


const getTitleContent = (property?: { title: NotionRichText[] } | null): string => {
  if (!property?.title?.length) return '';
  return property.title[0]?.plain_text ?? '';
};

const getNumberContent = (property?: NumberPropertyItemObjectResponse | null): number => {
  return property?.number ?? 0;
};

const getSelectContent = (property?: SelectPropertyItemObjectResponse | null): string => {
  if (!property?.select) return '';
  return property.select.name;
};

const getMultiSelectContent = (property?: MultiSelectPropertyItemObjectResponse | null): string[] => {
  if (!property?.multi_select) return [];
  return property.multi_select.map(item => item.name ?? '');
};

const getDateContent = (property?: DatePropertyItemObjectResponse | null): string => {
  if (!property?.date?.start) return '';
  return property.date.start;
};

const getRichTextArray = (property?: { rich_text: NotionRichText[] } | null): string[] => {
  if (!property?.rich_text?.length) return [];
  return property.rich_text.map(item => item.plain_text);
};

export const extractMovieData = (page: PageObjectResponse): Movie => {
  const props = page.properties as Partial<NotionPageProperties>;

  return {
    id: page.id,
    name: getTitleContent(props.Name),
    check: props.Check?.status?.name ?? '',
    slug: getRichTextContent(props.Slug),
    synopsis: getRichTextContent(props.Synopsis),
    totalScore: getNumberContent(props.TotalScore),
    familyScores: {
      father: getNumberContent(props.FatherScore),
      mother: getNumberContent(props.MotherScore),
      bigSister: getNumberContent(props.bigsisScore),
      littleSister: getNumberContent(props.littlesisScore),
    },
    reviews: {
      father: getRichTextContent(props.FatherReview),
      mother: getRichTextContent(props.MotherReview),
      bigSister: getRichTextContent(props.BigSisReview),
      littleSister: getRichTextContent(props.LittleSisReview),
    },
    genre: getSelectContent(props.Genre) || '',  // getSelectContent関数を使用
    director: getRichTextContent(props.Director),
    cast: getMultiSelectContent(props.Cast),
    screenwriter: getRichTextContent(props.Screenwriter),
    highlights: getRichTextArray(props.Highlights),
    watchedDate: getDateContent(props.WatchedDate),
    viewingPlatform: getSelectContent(props.ViewingPlatform),
    viewingUrl: props.ViewingUrl?.url ?? null,
    status: props.Status?.status?.name ?? 'Draft',
    monthDb: getSelectContent(props['DB-Month']),
    duration: getNumberContent(props.Duration),  // 上映時間を追加
    recommendedBy: getMultiSelectContent(props.recommendedBy),
    isBest5: Boolean(props.recommendedBy?.multi_select?.length),
  };
};


export const getMovieBySlug = cache(async (slug: string): Promise<Movie | null> => {
  if (!slug) {
    console.error('Slug is required');
    return null;
  }

  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      throw new Error('Missing environment variables');
    }

    const notion = new Client({
      auth: apiKey,
      notionVersion: '2022-06-28'
    });

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug
            }
          },
          {
            property: 'Status',
            status: {
              equals: 'Published'
            }
          }
        ]
      },
    });

    if (!response.results[0]) {
      console.warn(`No movie found with slug: ${slug}`);
      return null;
    }

    return extractMovieData(response.results[0] as PageObjectResponse);
  } catch (error) {
    console.error('Failed to fetch movie:', error);
    return null;
  }
});

// デバッグ情報付きバージョン
export const getMovies = unstable_cache(
  async () => {
    try {
      const apiKey = process.env.NOTION_API_KEY;
      const databaseId = process.env.NOTION_DATABASE_ID;

      if (!apiKey || !databaseId) {
        throw new Error('Missing environment variables');
      }

      const notion = new Client({
        auth: apiKey,
        notionVersion: '2022-06-28'
      });

      let allMovies: MovieListItem[] = [];
      let hasMore = true;
      let startCursor: string | undefined = undefined;

      while (hasMore) {
        const response = await notion.databases.query({
          database_id: databaseId,
          start_cursor: startCursor,
          page_size: 100,
          filter: {
            property: 'Status',
            status: {
              equals: 'Published'
            }
          },
          sorts: [
            {
              property: 'WatchedDate',
              direction: 'descending',
            }
          ],
        });

        const movies = response.results
          .filter((page): page is PageObjectResponse => 'properties' in page)
          .map(extractMovieListItem);

        allMovies = [...allMovies, ...movies];
        hasMore = response.has_more;
        startCursor = response.next_cursor ?? undefined;

        if (allMovies.length >= 300) {
          hasMore = false;
        }
      }

      return allMovies;
    } catch (error) {
      console.error('Notion API Error:', error);
      return [];
    }
  },
  [MOVIES_CACHE_KEY],
  {
    tags: [CACHE_TAG],
    revalidate: 3600 // 1時間
  }
);

export const extractMovieListItem = (page: PageObjectResponse): MovieListItem => {
  const movie = extractMovieData(page);
  
  return {
    id: movie.id,
    name: movie.name,
    slug: movie.slug,
    synopsis: movie.synopsis,
    totalScore: movie.totalScore,
    familyScores: movie.familyScores,
    watchedDate: movie.watchedDate,
    viewingPlatform: movie.viewingPlatform,
    viewingUrl: movie.viewingUrl,
    genre: movie.genre,
    check: movie.check,
    isBest5: movie.isBest5,
    recommendedBy: movie.recommendedBy,
    updatedAt: new Date().toISOString(), // updatedAtフィールドを追加
  };
};