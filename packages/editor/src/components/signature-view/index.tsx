/** @jsxImportSource @emotion/react */
import { UploadTask } from "prosekit/extensions/file";
import type { ReactNodeViewProps } from "prosekit/react";
import { useEffect, useState, useRef, type SyntheticEvent } from "react";
import { Box, Button, Flex, Text } from "@wraft/ui";
import {
  ArrowDownRight,
  ImageBroken,
  SpinnerGap,
  X,
} from "@phosphor-icons/react";
import type { SignatureAttrs } from "../../extensions/signature";
import {
  ModalWrapper,
  StyledResizableRoot,
  Image,
  UploadingOverlay,
  ErrorOverlay,
  StyledResizableHandle,
} from "./signature-view.styles";
import { SignatureCanvasComponent } from "./signature-canvas";

export default function SignatureView(props: ReactNodeViewProps) {
  const { setAttrs, node } = props;
  const attrs = node.attrs as SignatureAttrs;
  const signatureUrl = attrs.src || "";
  const isPlaceholder = attrs.placeholder;
  const isUploading = signatureUrl.startsWith("blob:");

  const [aspectRatio, setAspectRatio] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUploading) return;

    const uploadTask = UploadTask.get<string>(signatureUrl);
    if (!uploadTask) return;

    const abortController = new AbortController();

    const handleUploadSuccess = (resultUrl: string) => {
      if (abortController.signal.aborted) return;
      setAttrs({ src: resultUrl });
      UploadTask.delete(uploadTask.objectURL);
    };

    const handleUploadError = (error: Error) => {
      if (abortController.signal.aborted) return;
      setError(String(error));
      UploadTask.delete(uploadTask.objectURL);
    };

    void uploadTask.finished
      .then((resultUrl) => {
        if (resultUrl && typeof resultUrl === "string") {
          handleUploadSuccess(resultUrl);
        } else {
          handleUploadError(new Error("Unexpected upload result"));
        }
      })
      .catch(handleUploadError);

    const unsubscribe = uploadTask.subscribeProgress(({ loaded, total }) => {
      if (abortController.signal.aborted) return;
      if (total > 0) {
        setUploadProgress(loaded / total);
      }
    });

    return () => {
      unsubscribe();
      abortController.abort();
    };
  }, [signatureUrl, setAttrs]);

  const handleImageLoad = (event: SyntheticEvent) => {
    const img = event.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = img;

    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      if (ratio && Number.isFinite(ratio)) {
        setAspectRatio(ratio);
      }

      if (!attrs.width || !attrs.height) {
        setAttrs({ width: naturalWidth, height: naturalHeight });
      }
    }
  };

  const handleSignatureSave = (dataUrl: string) => {
    setAttrs({
      src: dataUrl,
      placeholder: false,
    });
    setIsSignatureModalOpen(false);
  };

  const handleSignatureCancel = () => {
    setIsSignatureModalOpen(false);
  };

  return (
    <>
      <div style={{ position: "relative" }} ref={containerRef}>
        <StyledResizableRoot
          width={attrs.width ?? undefined}
          height={attrs.height ?? undefined}
          aspectRatio={aspectRatio}
          className="signature-form"
          onResizeEnd={(event) => setAttrs(event.detail)}
          data-selected={props.selected ? "" : undefined}
        >
          {isPlaceholder && <div>Signature</div>}
          {!isPlaceholder && signatureUrl && !error && (
            <Image src={signatureUrl} onLoad={handleImageLoad} />
          )}

          {isUploading && !error && (
            <UploadingOverlay>
              <SpinnerGap size={8} />
              <div>{Math.round(uploadProgress * 100)}%</div>
            </UploadingOverlay>
          )}
          {error && (
            <ErrorOverlay>
              <ImageBroken size={8} />
              <div className="hidden opacity-80 @xs:block">
                Failed to upload image
              </div>
            </ErrorOverlay>
          )}
          <StyledResizableHandle position="bottom-right">
            <ArrowDownRight size={8} />
          </StyledResizableHandle>
        </StyledResizableRoot>
      </div>

      {isSignatureModalOpen && (
        <ModalWrapper
          ariaLabel="Signature Options"
          open={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
        >
          <Box>
            <Flex justifyContent="space-between" align="center" p="md">
              <Text variant="lg" fontWeight="heading">
                Signature
              </Text>
              <Button
                variant="ghost"
                onClick={() => setIsSignatureModalOpen(false)}
              >
                <X />
              </Button>
            </Flex>
            <SignatureCanvasComponent
              onSave={handleSignatureSave}
              onCancel={handleSignatureCancel}
            />
          </Box>
        </ModalWrapper>
      )}
    </>
  );
}
