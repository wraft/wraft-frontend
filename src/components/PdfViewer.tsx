import React, { useState } from 'react';

import {
  Document, Page,
} from 'react-pdf';

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { Text } from 'theme-ui';

interface PdfViewerProps {
  url?: string,
  width?: any;
  pageNumber?: any;
}

const PdfViewer = ({
  url, width
}: PdfViewerProps) => {

  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = (numPages: any)  => {
    console.log('error: ', numPages)
    setNumPages(numPages);
    setPageNumber(0);
  }

  // const onLoadError = (numPages: any)  => {
  //   console.log('error: ', numPages)
  //   setPageNumber(0)
  // }



  return (
    <Document file={url}>
      <Text>{numPages} {width}</Text>
      <Page
        pageNumber={pageNumber}
        width={960}
        onLoadSuccess={onDocumentLoadSuccess}
        // onSourceError={onLoadError}
      />
    </Document>
  );
}
export default PdfViewer;