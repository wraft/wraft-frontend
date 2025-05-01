/** @jsxImportSource @emotion/react */
import { UploadTask } from "prosekit/extensions/file";
import type { ReactNodeViewProps } from "prosekit/react";
import { ResizableHandle, ResizableRoot } from "prosekit/react/resizable";
import {
  useEffect,
  useState,
  useRef,
  type SyntheticEvent,
  useCallback,
} from "react";
import styled from "@emotion/styled";
import {
  ArrowDownRight,
  ImageBroken,
  SpinnerGap,
  Plus,
  Trash,
  UserPlus,
  FadersHorizontal,
  X,
  CloudArrowUp,
  Check,
} from "@phosphor-icons/react";
import { Accept, useDropzone } from "react-dropzone";
import {
  Modal,
  Tab,
  useTab,
  Button,
  InputText,
  Label,
  Flex,
  Box,
  Text,
} from "@wraft/ui";
import SignatureCanvas from "react-signature-canvas";
import type { SignatureAttrs } from "../extensions/signature";

type ExtendedSignatureCanvas = SignatureCanvas & {
  getCanvas: () => HTMLCanvasElement;
};

const Toolbar = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #212121;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
  width: 100%;
`;

const ToolbarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ModalWrapper = styled(Modal)`
  &[data-enter] {
    border-radius: 6px;
    padding: 0;
    max-width: 600px;
    width: 100%;
  }
`;

const StyledResizableRoot = styled(ResizableRoot)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0.5rem 0;
  max-height: 600px;
  max-width: 100%;
  min-height: 64px;
  min-width: 64px;
  outline: 2px solid transparent;

  background: #ccc;
  border: 1px solid #000;
  border-radius: 8px;
  &[data-selected] {
    outline-color: blue;
  }
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const UploadingOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem;
  background-color: rgba(31, 41, 55, 0.6);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  border-radius: 0.375rem;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: rgba(229, 231, 235);
  padding: 0.5rem;
  color: #111827;
  opacity: 0.8;
`;

const StyledResizableHandle = styled(ResizableHandle)`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0.375rem;
  padding: 0.25rem;
  background-color: rgba(31, 41, 55, 0.3);
  color: rgba(255, 255, 255, 0.5);
  border-radius: 0.375rem;
  transition: opacity 0.2s;
  &:hover,
  &:active,
  &[data-resizing] {
    background-color: rgba(31, 41, 55, 0.6);
    color: rgba(255, 255, 255, 0.8);
  }
  opacity: 0;
  group-hover &,
  &[data-resizing] {
    opacity: 1;
  }
`;

export default function SignatureView(props: ReactNodeViewProps) {
  const { setAttrs, node } = props;

  const attrs = node.attrs as SignatureAttrs;
  const url = attrs.src || "";
  const placeholder = attrs.placeholder;

  const [aspectRatio, setAspectRatio] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabStore = useTab();
  const selectedTabId = tabStore.useState("selectedId");
  const [showToolbar, setShowToolbar] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const sigCanvasRef = useRef<ExtendedSignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [objectUrl, setObjectUrl] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);

      const fileUrl = URL.createObjectURL(selectedFile);
      setObjectUrl(fileUrl);

      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 0.1;
        setProgress(Math.min(progressValue, 1));

        if (progressValue >= 1) {
          clearInterval(interval);
          setIsSubmit(true);
        }
      }, 100);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 1 * 1024 * 1024,
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  const handleCanvasSave = (dataUrl: string) => {
    setAttrs({
      src: dataUrl,
      placeholder: false,
    });
    setIsModalOpen(false);
  };

  const handleSaveSignature = () => {
    if (!sigCanvasRef.current) return;

    const targetWidth = attrs.width || 400;
    const targetHeight = attrs.height || 200;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;

    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    const signatureDataUrl = sigCanvasRef.current.toDataURL();

    const signatureImg = document.createElement("img");

    signatureImg.onload = () => {
      tempCtx.clearRect(0, 0, targetWidth, targetHeight);

      tempCtx.drawImage(signatureImg, 0, 0, targetWidth, targetHeight);

      const dataUrl = tempCanvas.toDataURL("image/png");
      handleCanvasSave(dataUrl);
    };

    signatureImg.src = signatureDataUrl;
  };

  const handleCanvasCancel = () => {
    setIsModalOpen(false);
  };

  const clearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setHasSignature(false);
    }
  };

  useEffect(() => {
    if (!url.startsWith("blob:")) {
      return;
    }

    const uploadTask = UploadTask.get<string>(url);
    if (!uploadTask) {
      return;
    }

    const abortController = new AbortController();
    void uploadTask.finished
      .then((resultUrl) => {
        if (resultUrl && typeof resultUrl === "string") {
          if (abortController.signal.aborted) {
            return;
          }
          setAttrs({ src: resultUrl });
        } else {
          if (abortController.signal.aborted) {
            return;
          }
          setError("Unexpected upload result");
        }
        UploadTask.delete(uploadTask.objectURL);
      })
      .catch((error) => {
        if (abortController.signal.aborted) {
          return;
        }
        setError(String(error));
        UploadTask.delete(uploadTask.objectURL);
      });
    const unsubscribe = uploadTask.subscribeProgress(({ loaded, total }) => {
      if (abortController.signal.aborted) {
        return;
      }
      if (total > 0) {
        setProgress(loaded / total);
      }
    });
    return () => {
      unsubscribe();
      abortController.abort();
    };
  }, [url, setAttrs]);

  const handleImageLoad = (event: SyntheticEvent) => {
    const img = event.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = img;
    const ratio = naturalWidth / naturalHeight;
    if (ratio && Number.isFinite(ratio)) {
      setAspectRatio(ratio);
    }
    if (naturalWidth && naturalHeight && (!attrs.width || !attrs.height)) {
      setAttrs({ width: naturalWidth, height: naturalHeight });
    }
  };

  const handleComponentClick = () => {
    setShowToolbar(true);
  };

  const handleAddClick = (e: any) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAttrs({
      src: "",
      placeholder: true,
    });
    setShowToolbar(false);
    setFile(null);
    setObjectUrl("");
    setProgress(0);
    setIsSubmit(false);
  };

  const handleAssignClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVerificationModalOpen(true);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerificationModalOpen(false);
    setShowToolbar(false);
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReupload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setObjectUrl("");
    setProgress(0);
    setIsSubmit(false);
  };

  useEffect(() => {
    if (isSubmit && objectUrl) {
      setAttrs({
        src: objectUrl,
        placeholder: false,
      });
    }
  }, [isSubmit, objectUrl]);

  useEffect(() => {
    if (isModalOpen) {
      tabStore.select("tab-0");
    }
  }, [isModalOpen]);

  return (
    <>
      <div style={{ position: "relative" }}>
        {showToolbar && (
          <Toolbar>
            <Flex align="center" onClick={handleAssignClick}>
              <ToolbarButton>
                <UserPlus size={24} />
                <Text color="white" mx="sm">
                  Assign
                </Text>
              </ToolbarButton>

              <ToolbarButton onClick={handleAddClick}>
                <Plus size={24} />
              </ToolbarButton>
              <ToolbarButton onClick={handleDeleteClick}>
                <Trash size={24} />
              </ToolbarButton>
              <ToolbarButton>
                <FadersHorizontal size={24} />
              </ToolbarButton>
            </Flex>
          </Toolbar>
        )}

        <ModalWrapper
          ariaLabel="User Verification"
          open={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
        >
          <Box>
            <Text variant="lg" fontWeight="heading" m="lg">
              Add Assign
            </Text>
            <form onSubmit={handleVerificationSubmit}>
              <Flex direction="column" gap="md" mx="lg">
                <Label>Full Name</Label>
                <InputText
                  name="name"
                  value={userInfo.name}
                  onChange={handleUserInfoChange}
                  placeholder="Enter your full name"
                  required
                />
                <Label>Email</Label>
                <InputText
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={userInfo.email}
                  onChange={handleUserInfoChange}
                  required
                />
                <Box py="lg">
                  <Button type="submit">Submit</Button>
                </Box>
              </Flex>
            </form>
          </Box>
        </ModalWrapper>

        <StyledResizableRoot
          width={attrs.width ?? undefined}
          height={attrs.height ?? undefined}
          aspectRatio={aspectRatio}
          onResizeEnd={(event) => setAttrs(event.detail)}
          data-selected={props.selected ? "" : undefined}
          onClick={handleComponentClick}
        >
          {placeholder && <div>Signature</div>}
          {!placeholder && url && !error && (
            <Image src={url} onLoad={handleImageLoad} />
          )}

          {uploading && !error && (
            <UploadingOverlay>
              <SpinnerGap size={8} />
              <div>{Math.round(progress * 100)}%</div>
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

      {isModalOpen && selectedTabId && (
        <ModalWrapper
          ariaLabel="Signature Options"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Box>
            <Flex justifyContent="space-between" align="center" p="md">
              <Text variant="lg" fontWeight="heading">
                Signature
              </Text>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                <X />
              </Button>
            </Flex>
            <Tab.List store={tabStore}>
              <Tab id="tab-0" store={tabStore}>
                <Flex align="center" gap="sm">
                  <Text
                    variant="lg"
                    fontWeight="semibold"
                    color={selectedTabId === "tab-0" ? "" : "text-secondary"}
                  >
                    Draw
                  </Text>
                </Flex>
              </Tab>
              <Tab id="tab-1" store={tabStore}>
                <Flex align="center" gap="sm">
                  <Text
                    variant="lg"
                    fontWeight="semibold"
                    color={selectedTabId === "tab-1" ? "" : "text-secondary"}
                  >
                    File Upload
                  </Text>
                </Flex>
              </Tab>
            </Tab.List>

            <Box p="xl" minH="md">
              {selectedTabId === "tab-0" && (
                <>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="lg"
                    padding="lg"
                    background="white"
                    borderRadius="sm"
                    boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)"
                  >
                    <SignatureCanvas
                      ref={sigCanvasRef}
                      penColor="black"
                      velocityFilterWeight={0.7}
                      minWidth={1.5}
                      maxWidth={2.5}
                      canvasProps={{
                        width: 500,
                        height: 200,
                        style: {
                          border: "1px solid #ddd",
                          background: "white",
                          touchAction: "none",
                          cursor: "crosshair",
                          display: "block",
                          width: "500px",
                          height: "200px",
                        },
                      }}
                      onEnd={() => setHasSignature(true)}
                    />
                    <Flex justifyContent="space-between" mx="sm">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={clearSignature}
                      >
                        Clear
                      </Button>
                    </Flex>
                  </Box>

                  <Box py="xl">
                    <Text color="text-secondary">
                      Draw your signature above. You can clear and redraw if
                      needed. Lorem ipsum, dolor sit amet consectetur
                      adipisicing elit. Rerum sint assumenda repudiandae
                      debitis, cupiditate a. Corporis dolor, minima autem nulla
                      illo cupiditate deleniti et culpa repudiandae beatae
                      maxime ipsa dolore! Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Molestias necessitatibus dicta tenetur
                      blanditiis quae voluptatem ducimus dolore, consequuntur
                      veniam cum voluptates hic sed optio eum, accusamus
                      sapiente autem rerum ut!
                    </Text>

                    <Flex justifyContent="space-between" mt="3xl">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCanvasCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSaveSignature}
                        disabled={!hasSignature}
                      >
                        Accept and sign
                      </Button>
                    </Flex>
                  </Box>
                </>
              )}

              {selectedTabId === "tab-1" && (
                <>
                  <Box w="100%" border="1px dashed" borderRadius="sm">
                    <Box
                      {...getRootProps()}
                      w="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      borderRadius="sm"
                      h="100%"
                      py="lg"
                      px="sm"
                    >
                      <input {...getInputProps()} />

                      {!file && (
                        <>
                          <Box
                            h="xl"
                            w="xl"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            borderRadius="sm"
                          >
                            <CloudArrowUp size={32} />
                          </Box>
                          <Flex
                            flexDirection="column"
                            alignItems="center"
                            mt="md"
                          >
                            <Text mb="sm">
                              Drag & drop or upload signature file
                            </Text>
                            <Text>PNG, JPG, GIF - Max file size 1MB</Text>
                          </Flex>
                        </>
                      )}

                      {file && (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Flex alignItems="center">
                            <Text>{file.name}</Text>
                            {progress >= 1 && (
                              <Box
                                h="lg"
                                w="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                bg="green"
                                borderRadius="4xl"
                                ml="xss"
                              >
                                <Check color="white" height={12} width={12} />
                              </Box>
                            )}
                          </Flex>
                          <Button variant="tertiary" onClick={handleReupload}>
                            re-upload
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Flex justifyContent="space-between" mt="3xl">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        if (objectUrl) {
                          setAttrs({
                            src: objectUrl,
                            placeholder: false,
                          });
                          setIsModalOpen(false);
                        }
                      }}
                      disabled={!objectUrl}
                    >
                      Insert Signature
                    </Button>
                  </Flex>
                </>
              )}
            </Box>
          </Box>
        </ModalWrapper>
      )}
    </>
  );
}
