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

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

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
  BEST5: MultiSelectPropertyItemObjectResponse;
  'DB-Month': SelectPropertyItemObjectResponse;
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
  return property.select.name ?? '';
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
    director: getRichTextContent(props.Director),
    cast: getMultiSelectContent(props.Cast),
    screenwriter: getRichTextContent(props.Screenwriter),
    highlights: getRichTextArray(props.Highlights),
    watchedDate: getDateContent(props.WatchedDate),
    viewingPlatform: getSelectContent(props.ViewingPlatform),
    viewingUrl: props.ViewingUrl?.url ?? null,
    status: props.Status?.status?.name ?? 'Draft',
    isBest5: Boolean(props.BEST5?.multi_select?.length),
    monthDb: getSelectContent(props['DB-Month']),
  };
};


export const getMovieBySlug = cache(async (slug: string): Promise<Movie | null> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
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

    if (!response.results[0]) return null;
    return extractMovieData(response.results[0] as PageObjectResponse);
  } catch (error) {
    console.error('Failed to fetch movie:', error);
    return null;
  }
});

// getMovies関数のエクスポート
// デバッグ情報付きバージョン
export const getMovies = cache(async (): Promise<MovieListItem[]> => {
  try {
    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID is not defined');
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
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
      page_size: 100
    });

    // 開発環境のみデバッグログを出力
    if (process.env.NODE_ENV === 'development') {
      console.log('Total results:', response.results.length);
      console.log('Has more:', response.has_more);
    }

    const movies = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(extractMovieListItem);

    return movies;

  } catch (error) {
    // エラーログは本番環境でも残す（重要なため）
    console.error('Notion API Error:', error);
    return [];
  }
});

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
    viewingUrl: movie.viewingUrl,  // viewingUrlを追加
    isBest5: movie.isBest5,
  };
};