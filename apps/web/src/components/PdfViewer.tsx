import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Text } from 'theme-ui';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfViewerProps {
  url?: string;
  width?: any;
  pageNumber?: any;
}

export const repeat = (times: number) => (callback: (index: number) => any) =>
  Array(times)
    .fill(0)
    .map((_, index) => callback(index));

const PdfViewer = ({ url }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<any>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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
        {repeat(numPages)((index) => (
          // TODO: Dynamically resize width to fit container
          // https://github.com/wojtekmaj/react-pdf/issues/129
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      <Text sx={{ display: 'none' }}>{pageNumber}</Text>
    </React.Fragment>
  );
};
export default PdfViewer;
