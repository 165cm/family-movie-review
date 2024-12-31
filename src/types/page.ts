// src/types/page.ts
export interface PageParams {
    slug: string;
  }
  
  export interface SearchParams {
    [key: string]: string | string[] | undefined;
  }
  
  export interface PageProps {
    params: PageParams;
    searchParams?: SearchParams;
  }