import { union, insertNode } from "prosekit/core";
import {
  defineFileDropHandler,
  defineFilePasteHandler,
  UploadTask,
  type Uploader,
} from "prosekit/extensions/file";

/**
 * Returns an extension that handles image file uploads when pasting or dropping
 * images into the editor.
 */
export function defineImageFileHandlers() {
  return union(
    defineFilePasteHandler(({ view, file }) => {
      // Only handle image files
      if (!file.type.startsWith("image/")) {
        return false;
      }

      // Upload the image to https://tmpfiles.org/
      const uploadTask = new UploadTask({
        file,
        uploader: tmpfilesUploader,
      });

      // Insert the image node at the current text selection position
      const command = insertNode({
        type: "image",
        attrs: { src: uploadTask.objectURL },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method -- view.dispatch is safely bound by prosekit
      return command(view.state, view.dispatch, view);
    }),
    defineFileDropHandler(({ view, file, pos }) => {
      // Only handle image files
      if (!file.type.startsWith("image/")) {
        return false;
      }

      // Upload the image to https://tmpfiles.org/
      const uploadTask = new UploadTask({
        file,
        uploader: tmpfilesUploader,
      });

      // Insert the image node at the drop position
      const command = insertNode({
        type: "image",
        attrs: { src: uploadTask.objectURL },
        pos,
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method -- view.dispatch is safely bound by prosekit
      return command(view.state, view.dispatch, view);
    }),
  );
}

/**
 * Uploads the given file to https://tmpfiles.org/ and returns the URL of the
 * uploaded file.
 *
 * This function is only for demonstration purposes. All uploaded files will be
 * deleted after 1 hour.
 */
const tmpfilesUploader: Uploader<string> = ({
  file,
  onProgress,
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- onProgress is optional parameter
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
        });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const json = JSON.parse(xhr.responseText);
          const url: string = (json.data.url as string).replace(
            "tmpfiles.org/",
            "tmpfiles.org/dl/",
          );

          // Simulate a larger delay
          setTimeout(() => resolve(url), 1000);
        } catch (error) {
          reject(new Error("Failed to parse response", { cause: error }));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("POST", "https://tmpfiles.org/api/v1/upload", true);
    xhr.send(formData);
  });
};
