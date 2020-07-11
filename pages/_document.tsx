import Document, { Html, Head, Main, NextScript } from 'next/document';

const structuredData :any = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dieture',
  alternateName: 'Diet Center in Qatar',
  url: 'https://dieture.com',
  logo: 'https://dieture.com/2019/images/logo.svg',
  sameAs: [
    'https://www.facebook.com/dieture/app/208195102528120/?ref=page_internal',
    'https://twitter.com/dieture',
    'https://www.instagram.com/dieture',
    'https://www.youtube.com/user/dieture',
    'https://www.linkedin.com/in/dieture',
    'https://in.pinterest.com/dieture01',
    'https://dieture.com',
  ],
};

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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
