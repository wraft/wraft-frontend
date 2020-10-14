import Document, { Html, Head, Main, NextScript } from 'next/document';

const structuredData: any = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Wraft',
  alternateName: 'Document Automation Platform',
  url: 'https://wraft.co',
  logo: 'https://wraft.co/logo.svg',
  sameAs: [
    'https://www.facebook.com/wraftco/app/208195102528120/?ref=page_internal',
    'https://twitter.com/wraftco',
    'https://www.instagram.com/wraftco',
    'https://www.youtube.com/user/wraftco',
    'https://www.linkedin.com/in/wraftco',
    'https://in.pinterest.com/wraftco',
    'https://wraft.co',
  ],
};

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
