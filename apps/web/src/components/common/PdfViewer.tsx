import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Text } from '@wraft/ui';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url?: string;
  width?: any;
  pageNumber?: any;
  height?: any;
}

export const repeat = (times: number) => (callback: (index: number) => any) =>
  Array(times)
    .fill(0)
    .map((_, index) => callback(index));

const PdfViewer = ({ url, height }: PdfViewerProps) => {
  const [totalPages, setTotalPages] = useState<any>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setPageNumber(1);
  };

  return (
    <React.Fragment>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <style
          // scoped
          dangerouslySetInnerHTML={{
            __html: ` canvas { margin: auto; }`,
          }}
        />
        {repeat(totalPages)((index) => (
          // TODO: Dynamically resize width to fit container
          // https://github.com/wojtekmaj/react-pdf/issues/129
          <Page
            height={height}
            key={`page_${index + 1}`}
            pageNumber={index + 1}
          />
        ))}
      </Document>
      <Text display="none">{pageNumber}</Text>
    </React.Fragment>
  );
};
export default PdfViewer;
