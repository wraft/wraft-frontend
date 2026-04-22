import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import axios from 'axios';
import {
  PDFDocument,
  PDFRef,
  PDFName,
  PDFDict,
  pushGraphicsState,
  translate,
  rotateInPlace,
  drawObject,
  popGraphicsState,
  PDFCheckBox,
  PDFRadioGroup,
  PDFPage,
  PDFField,
  PDFWidgetAnnotation,
} from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Flex, Text, Button, Modal, Select } from '@wraft/ui';
import { Signature, X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import cookie from 'js-cookie';

import { postAPI } from 'utils/models';

import { useDocument } from '../DocumentContext';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url?: string;
  signerBoxes?: any;
}

interface AnnotationDetailsType {
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
  originalPageWidth: number;
  originalPageHeight: number;
}

const getTrustedHosts = () => {
  const trustedHosts = new Set<string>();

  if (typeof window !== 'undefined') {
    trustedHosts.add(window.location.host);
  }

  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  if (apiHost) {
    try {
      if (apiHost.startsWith('http://') || apiHost.startsWith('https://')) {
        trustedHosts.add(new URL(apiHost).host);
      } else {
        trustedHosts.add(new URL(`http://${apiHost}`).host);
        trustedHosts.add(new URL(`https://${apiHost}`).host);
      }
    } catch (error) {
      console.error('Invalid NEXT_PUBLIC_API_HOST:', error);
    }
  }

  return trustedHosts;
};

const shouldAttachAuthHeader = (requestUrl: string) => {
  if (typeof window === 'undefined') return false;

  try {
    const parsedUrl = new URL(requestUrl, window.location.origin);
    return getTrustedHosts().has(parsedUrl.host);
  } catch (error) {
    console.error('Invalid PDF URL:', error);
    return false;
  }
};

// PDF utility functions
const _flattenWidget = (
  document: PDFDocument,
  field: PDFField,
  widget: PDFWidgetAnnotation,
) => {
  try {
    const page = getPageForWidget(document, widget);
    if (!page) return;

    const appearanceRef = getAppearanceRefForWidget(field, widget);
    if (!appearanceRef) return;

    const xObjectKey = page.node.newXObject('FlatWidget', appearanceRef);

    const rectangle = widget.getRectangle();
    const operators = [
      pushGraphicsState(),
      translate(rectangle.x, rectangle.y),
      ...rotateInPlace({ ...rectangle, rotation: 0 }),
      drawObject(xObjectKey),
      popGraphicsState(),
    ].filter((op) => !!op);

    page.pushOperators(...operators);
  } catch (error) {
    console.error(error);
  }
};

const getPageForWidget = (
  document: PDFDocument,
  widget: PDFWidgetAnnotation,
) => {
  const pageRef = widget.P();
  let foundPage = document
    .getPages()
    .find((page: PDFPage) => page.ref === pageRef);

  if (!foundPage) {
    const widgetRef = document.context.getObjectRef(widget.dict);
    if (!widgetRef) return null;

    foundPage = document.findPageForAnnotationRef(widgetRef);
    if (!foundPage) return null;
  }

  return foundPage;
};

const getAppearanceRefForWidget = (
  field: PDFField,
  widget: PDFWidgetAnnotation,
) => {
  try {
    const normalAppearance = widget.getNormalAppearance();
    if (!normalAppearance) {
      console.error('Normal appearance is undefined for widget.');
      return null;
    }

    let normalAppearanceRef = null;

    if (normalAppearance instanceof PDFRef) {
      normalAppearanceRef = normalAppearance;
    }

    if (
      normalAppearance instanceof PDFDict &&
      (field instanceof PDFCheckBox || field instanceof PDFRadioGroup)
    ) {
      const value = field.acroField.getValue();
      const ref =
        normalAppearance.get(value) ?? normalAppearance.get(PDFName.of('Off'));

      if (ref instanceof PDFRef) {
        normalAppearanceRef = ref;
      }
    }

    return normalAppearanceRef;
  } catch (error) {
    console.error('Error in getAppearanceRefForWidget:', error);
    return null;
  }
};

const PdfSignerViewer = ({ url, signerBoxes }: PdfViewerProps) => {
  const [selectedCounterparty, setSelectedCounterparty] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [currentSignBox, setCurrentSignBox] = useState<any>(null);
  const [annotationDetails, setAnnotationDetails] =
    useState<AnnotationDetailsType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentPdfObjectUrlRef = useRef<string | null>(null);

  const {
    signers,
    cId: contentId,
    inviteType,
    setSignerBoxes,
    token,
  } = useDocument();
  const renderWidth = 760;

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    let disposed = false;

    setPdfUrl(null);
    setAnnotationDetails(null);

    const modifyPdf = async () => {
      try {
        const authToken = token || cookie.get('token');
        const canAttachAuthHeader = shouldAttachAuthHeader(url);
        const response = await axios.get(url, {
          signal: controller.signal,
          timeout: 30000,
          responseType: 'arraybuffer',
          headers:
            authToken && canAttachAuthHeader
              ? {
                  Authorization: `Bearer ${authToken}`,
                }
              : undefined,
        });
        if (disposed || controller.signal.aborted) return;
        const existingPdfBytes = response.data;
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        if (disposed || controller.signal.aborted) return;

        const page = pdfDoc.getPages()[0];
        const pageHeight = page.getHeight();
        const pageWidth = page.getWidth();

        // Define the annotation box position
        const x = 70.87;
        const y = pageHeight - 482.09 - 30;
        const width = 200;
        const height = 30;

        // Store details for overlay
        setAnnotationDetails({
          x,
          y,
          width,
          height,
          pageIndex: 0,
          originalPageWidth: pageWidth,
          originalPageHeight: pageHeight,
        });

        const form = pdfDoc.getForm();
        form.updateFieldAppearances();

        if (!form) {
          console.error('Form is not initialized in the PDF document.');
          return;
        }

        const modifiedPdfBytes = await pdfDoc.save();
        if (disposed || controller.signal.aborted) return;
        const safePdfBuffer = new Uint8Array(modifiedPdfBytes).buffer;
        const blob = new Blob([safePdfBuffer], { type: 'application/pdf' });
        const pdfObjectUrl = URL.createObjectURL(blob);

        if (currentPdfObjectUrlRef.current) {
          URL.revokeObjectURL(currentPdfObjectUrlRef.current);
        }
        currentPdfObjectUrlRef.current = pdfObjectUrl;
        setPdfUrl(pdfObjectUrl);
      } catch (error) {
        if (axios.isCancel(error)) return;
        setPdfUrl(null);
        setAnnotationDetails(null);
        console.error('Error loading or modifying PDF:', error);
        toast.error('Failed to load PDF for signing');
      }
    };

    modifyPdf();

    return () => {
      disposed = true;
      controller.abort();
      if (currentPdfObjectUrlRef.current) {
        URL.revokeObjectURL(currentPdfObjectUrlRef.current);
        currentPdfObjectUrlRef.current = null;
      }
    };
  }, [url, token]);

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }) => {
    setNumPages(nextNumPages);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    postAPI(`contents/${contentId}/signatures/${currentSignBox.id}/assign`, {
      counterparty_id: selectedCounterparty,
    })
      .then((response: any) => {
        setSignerBoxes((prev: any) =>
          prev.map((box: any) =>
            box.id === currentSignBox.id
              ? {
                  ...box,
                  ...response,
                }
              : box,
          ),
        );
        setIsSignatureModalOpen(false);
        toast.success('Saved Successfully', {
          duration: 1000,
          position: 'top-right',
        });
      })
      .catch((error) => {
        console.error('Error assigning counterparty:', error);
        toast.error('Failed to save');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSelectChange = (value: string) => {
    setSelectedCounterparty(value);
  };

  const toRgbString = ({ r, g, b }: { r: number; g: number; b: number }) => {
    return `rgb(${r}, ${g}, ${b})`;
  };

  const renderSignatureBox = (
    signerBox: any,
    scale: number,
    pageHeight: number,
    page: number,
  ) => {
    if (
      signerBox?.signature_data?.page !== page ||
      signerBox?.counter_party?.signature_status === 'signed'
    ) {
      return null;
    }

    const boxStyle: CSSProperties = {
      position: 'absolute',
      left: `${signerBox.signature_data.coordinates.x1 * scale - 1}px`,
      top: `${pageHeight - signerBox.signature_data.coordinates.y1 * scale - signerBox.signature_data.dimensions.height * scale}px`,
      width: `${signerBox.signature_data.dimensions.width * scale + 2}px`,
      height: `${signerBox.signature_data.dimensions.height * scale + 2}px`,
      backgroundColor: signerBox?.counter_party?.color_rgb
        ? toRgbString(signerBox.counter_party.color_rgb)
        : '#e3f7ee',
      cursor: currentSignBox?.counter_party ? 'default' : 'pointer',
      zIndex: 10,
      border: '1px dashed #006f50',
      borderColor: '#006f50',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };

    return (
      <Box
        as="div"
        key={`overlay_${signerBox.id}`}
        style={boxStyle}
        onClick={() => {
          setCurrentSignBox(signerBox);
          if (!inviteType) {
            setIsSignatureModalOpen(true);
          }
        }}>
        <Flex direction="column" gap="xs" alignItems="center">
          <Flex alignItems="center" gap="xs">
            <Signature size={20} />
            <Text variant="sm" color="#000" fontWeight="heading">
              Signature
            </Text>
          </Flex>
          {!signerBox?.counter_party?.name && (
            <Text variant="sm" fontWeight="heading" color="text-secondary">
              Click and Select a Signer
            </Text>
          )}
          <Text variant="sm" fontWeight="heading">
            {signerBox?.counter_party?.name}
          </Text>
        </Flex>
      </Box>
    );
  };

  const renderSignerModal = (): React.ReactElement => {
    return (
      <Box w="400px">
        <Flex justifyContent="space-between" alignItems="center" mb="lg">
          <Text as="h3" fontSize="2xl">
            Add Counterparty
          </Text>
          <X
            size={20}
            weight="bold"
            cursor="pointer"
            className="main-icon"
            onClick={() => setIsSignatureModalOpen(false)}
          />
        </Flex>
        <Text color="text-secondary" mb="md">
          Select a signer to add as a counterparty to this document. The
          selected person will be able to review and sign the agreement.
        </Text>
        <form onSubmit={handleFormSubmit}>
          <Flex direction="column" gap="md">
            <Select
              value={selectedCounterparty}
              onChange={handleSelectChange}
              required
              options={[
                { value: '', label: 'Select a Signer' },
                ...signers.map((signer) => ({
                  value: signer.id,
                  label: signer.name,
                  email: signer.email,
                })),
              ]}
              renderItem={(item: any) => (
                <Box>
                  <Text fontWeight="heading">{item.label}</Text>
                  <Text variant="sm" color="text-secondary">
                    {item.email}
                  </Text>
                </Box>
              )}
            />
            <Box pt="xl" ml="auto">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}>
                Add Counterparty
              </Button>
            </Box>
          </Flex>
        </form>
      </Box>
    );
  };

  return (
    <React.Fragment>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (_, index) => {
          const scale =
            renderWidth / (annotationDetails?.originalPageWidth || 595);
          const pageHeight =
            (annotationDetails?.originalPageHeight || 842) * scale;
          const page = index + 1;

          return (
            <div
              key={`page_container_${page}`}
              style={{ position: 'relative', marginBottom: '20px' }}>
              <Page
                key={`page_${page}`}
                pageNumber={page}
                width={renderWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}>
                {signerBoxes &&
                  signerBoxes.map((signerBox: any) =>
                    renderSignatureBox(signerBox, scale, pageHeight, page),
                  )}
              </Page>
            </div>
          );
        })}
      </Document>

      <Modal
        ariaLabel="Signature Options"
        open={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}>
        {renderSignerModal()}
      </Modal>
    </React.Fragment>
  );
};

export default PdfSignerViewer;
