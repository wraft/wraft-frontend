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

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { InitializeColorMode } from 'theme-ui';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins&family=Inter&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <InitializeColorMode />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
