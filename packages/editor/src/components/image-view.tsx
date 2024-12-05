/** @jsxImportSource @emotion/react */
import { UploadTask } from "prosekit/extensions/file";
import type { ImageAttrs } from "prosekit/extensions/image";
import type { ReactNodeViewProps } from "prosekit/react";
import { ResizableHandle, ResizableRoot } from "prosekit/react/resizable";
import { useEffect, useState, type SyntheticEvent } from "react";
import styled from "@emotion/styled";
import { ArrowDownRight, ImageBroken, SpinnerGap } from "@phosphor-icons/react";

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
export default function ImageView(props: ReactNodeViewProps) {
  const { setAttrs, node } = props;
  const attrs = node.attrs as ImageAttrs;
  const url = attrs.src || "";
  const uploading = url.startsWith("blob:");

  const [aspectRatio, setAspectRatio] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);

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

  return (
    <StyledResizableRoot
      width={attrs.width ?? undefined}
      height={attrs.height ?? undefined}
      aspectRatio={aspectRatio}
      onResizeEnd={(event) => setAttrs(event.detail)}
      data-selected={props.selected ? "" : undefined}
    >
      {url && !error && <Image src={url} onLoad={handleImageLoad} />}
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
  );
}
