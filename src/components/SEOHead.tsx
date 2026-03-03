/**
 * SEOHead - React 19 Document Metadata를 활용한 페이지별 SEO 컴포넌트
 * React 19에서는 <title>, <meta>, <link> 태그를 컴포넌트 트리 어디서든 렌더링하면
 * 자동으로 <head>에 호이스팅됩니다.
 */

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

const BASE_URL = 'https://sierra-be167.web.app';
const DEFAULT_TITLE = '시애라(Sierra) - 리더들을 위한 프리미엄 등산 커뮤니티';
const DEFAULT_DESCRIPTION = '2005년 창립, 21년 전통의 하이 트러스트 등산 커뮤니티. CEO·임원·전문직 리더들이 산행을 통해 심신을 단련하고 신뢰 네트워크를 구축하는 품격 있는 교류의 장.';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | 시애라(Sierra)` : DEFAULT_TITLE;
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
