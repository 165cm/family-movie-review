// test-slug.ts
const testSlug = (slug: string) => {
    console.log('Raw slug:', slug);
    console.log('Encoded slug:', encodeURIComponent(slug));
  };