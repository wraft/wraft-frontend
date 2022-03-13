import React, { useState } from 'react';

import {
  Document, Page,
} from 'react-pdf';

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
  }

  const onLoadError = (numPages: any)  => {
    console.log('error: ', numPages)
  }

  return (
    <Document file={url}>
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