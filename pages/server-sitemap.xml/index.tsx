// pages/server-sitemap.xml/index.tsx
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { getMovies } from '@/app/lib/notion'

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // 映画データの取得
    const movies = await getMovies()
    
    // サイトマップフィールドの生成
    const fields: ISitemapField[] = movies.map(movie => ({
      loc: `${process.env.NEXT_PUBLIC_BASE_URL}/movies/${movie.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }))

    // getServerSideSitemapの引数順序を修正（contextを先に）
    await getServerSideSitemap(fields, ctx)
    
    return {
      props: {},
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return {
      props: {},
      notFound: true
    }
  }
}

// Next.jsはデフォルトエクスポートを要求
export default function Sitemap() {
  return null
}