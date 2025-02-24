import { useEditor } from "prosekit/react";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "prosekit/react/popover";
import { useState, type FC, type ReactNode } from "react";
import styled from "@emotion/styled";
import cookie from "js-cookie";
import Button from "./button";
import type { EditorExtension } from "./extension";

const StyledPopoverContent = styled(PopoverContent)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  font-size: 14px;
  width: 384px;
  z-index: 10;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid #d4d4d4;
  background-color: #ffffff;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition-property: transform, opacity;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

  &[data-state="open"] {
    animation:
      fade-in-0 150ms,
      zoom-in-95 150ms;
  }

  &[data-state="closed"] {
    animation:
      fade-out-0 200ms,
      zoom-out-95 200ms;
  }

  &[data-side="bottom"] {
    animation-name: slide-in-from-top-2, slide-out-to-top-2;
  }

  &[data-side="left"] {
    animation-name: slide-in-from-right-2, slide-out-to-right-2;
  }

  &[data-side="right"] {
    animation-name: slide-in-from-left-2, slide-out-to-left-2;
  }

  &[data-side="top"] {
    animation-name: slide-in-from-bottom-2, slide-out-to-bottom-2;
  }

  @keyframes fade-in-0 {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out-0 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes zoom-in-95 {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes zoom-out-95 {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.95);
    }
  }

  @keyframes slide-in-from-top-2 {
    from {
      transform: translateY(-8px);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-out-to-top-2 {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-8px);
    }
  }

  @keyframes slide-in-from-right-2 {
    from {
      transform: translateX(8px);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-to-right-2 {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(8px);
    }
  }

  @keyframes slide-in-from-left-2 {
    from {
      transform: translateX(-8px);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-to-left-2 {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-8px);
    }
  }

  @keyframes slide-in-from-bottom-2 {
    from {
      transform: translateY(8px);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-out-to-bottom-2 {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(8px);
    }
  }
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  outline-offset: 2px;
  transition-property: background-color, color;
  transition-duration: 150ms;
  height: 40px;
  padding: 0 16px;
  width: 100%;
  border: 0;
  background-color: #18181b;
  color: #f4f4f5;

  &:hover {
    background-color: #27272a;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  height: 36px;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 8px 12px;
  font-size: 14px;
  color: #18181b;
  border: 1px solid #d4d4d4;
  transition-property: background-color, border-color;
  transition-duration: 150ms;

  &::placeholder {
    color: #71717a;
  }

  &:focus {
    outline: 2px solid #27272a;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ImageUploadPopover: FC<{
  tooltip: string;
  disabled: boolean;
  children: ReactNode;
}> = ({ tooltip, disabled, children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState("");

  const editor = useEditor<EditorExtension>();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const uploadfile: any = event.target.files?.[0];

    if (uploadfile) {
      setFile(uploadfile);
    }
  };

  // const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
  //   event
  // ) => {
  //   const file = event.target.files?.[0];

  //   if (file) {
  //     console.log("file", file);
  //     // setObjectUrl(URL.createObjectURL(file));
  //     setWebUrl("");
  //   } else {
  //     setObjectUrl("");
  //   }
  // };

  const handleSubmit = async () => {
    if (!file) {
      // setMessage("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", "Document Asset");
    formData.append("type", "document");

    console.log("formData", formData);

    // setUploading(true);
    // setMessage("");
    const token = cookie.get("token");

    try {
      const response = await fetch("http://localhost:4000/api/v1/assets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      editor.commands.insertImage({
        src: `/asset/image/${data.id}`,
        width: 400,
      });
      deferResetState();
      setOpen(false);
    } catch (error) {
      // setMessage("Upload failed. Please try again.");
    } finally {
      // setUploading(false);
    }
  };

  const deferResetState = () => {
    setTimeout(() => {
      setFile("");
    }, 300);
  };

  // const handleSubmit = () => {
  //   editor.commands.insertImage({ src: url });
  //   deferResetState();
  //   setOpen(false);
  // };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      deferResetState();
    }
    setOpen(open);
  };

  return (
    <PopoverRoot open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button pressed={open} disabled={disabled} tooltip={tooltip}>
          {children}
        </Button>
      </PopoverTrigger>

      <StyledPopoverContent>
        <>
          <label>Upload</label>
          <StyledInput
            accept="image/*"
            type="file"
            onChange={handleFileChange}
          />
        </>

        {file ? (
          <StyledButton onClick={handleSubmit}>Insert Image</StyledButton>
        ) : null}
      </StyledPopoverContent>
    </PopoverRoot>
  );
};
