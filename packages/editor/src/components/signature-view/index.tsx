/** @jsxImportSource @emotion/react */
import { UploadTask } from "prosekit/extensions/file";
import type { ReactNodeViewProps } from "prosekit/react";
import { useEffect, useState, useRef, type SyntheticEvent } from "react";
import {
  ArrowDownRight,
  ImageBroken,
  SpinnerGap,
  Plus,
  Trash,
  UserPlus,
  X,
} from "@phosphor-icons/react";
import { Box, Button, Flex, Text } from "@wraft/ui";
import type { SignatureAttrs } from "../../extensions/signature";
import {
  Toolbar,
  ToolbarButton,
  ModalWrapper,
  StyledResizableRoot,
  Image,
  UploadingOverlay,
  ErrorOverlay,
  StyledResizableHandle,
} from "./signature-view.styles";
import { SignatureCanvasComponent } from "./SignatureCanvas";
import { AssignModal } from "./AssignModal";

interface UserInfo {
  name: string;
  email: string;
}

interface Counterparty {
  id: string;
  name: string;
  email: string;
}

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
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock counterparties list - in a real app this would come from an API or context
  const counterpartiesList = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ];

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

  const handleContainerClick = () => {
    setIsToolbarVisible(true);
  };

  const handleAddSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSignatureModalOpen(true);
  };

  const handleDeleteSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAttrs({
      src: "",
      placeholder: true,
    });
    setIsToolbarVisible(false);
  };

  const handleAssignSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAssignModalOpen(true);
  };

  const handleVerificationSubmit = (counterparty: Counterparty) => {
    setAttrs({
      ...attrs,
      counterparty: {
        id: counterparty.id,
        name: counterparty.name,
        email: counterparty.email,
      },
    });
    setIsAssignModalOpen(false);
    setIsToolbarVisible(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsToolbarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div style={{ position: "relative" }} ref={containerRef}>
        {isToolbarVisible && (
          <Toolbar>
            <Flex align="center">
              <ToolbarButton onClick={handleAssignSignature}>
                <UserPlus size={24} />
                <Text color="white" mx="sm">
                  Assign
                </Text>
              </ToolbarButton>

              <ToolbarButton onClick={handleAddSignature}>
                <Plus size={24} />
              </ToolbarButton>

              <ToolbarButton onClick={handleDeleteSignature}>
                <Trash size={24} />
              </ToolbarButton>
            </Flex>
          </Toolbar>
        )}

        <ModalWrapper
          ariaLabel="User Verification"
          open={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
        >
          <AssignModal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            onSubmit={handleVerificationSubmit}
            counterparties={counterpartiesList}
          />
        </ModalWrapper>

        <StyledResizableRoot
          width={attrs.width ?? undefined}
          height={attrs.height ?? undefined}
          aspectRatio={aspectRatio}
          className="signature-form"
          onResizeEnd={(event) => setAttrs(event.detail)}
          data-selected={props.selected ? "" : undefined}
          onClick={handleContainerClick}
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
